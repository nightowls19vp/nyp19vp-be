/* eslint-disable prefer-const */
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  CreateGrReqDto,
  GetGrResDto,
  GroupDto,
  PackageDto,
  AddGrMbReqDto,
  RmGrMbReqDto,
  UpdateGrPkgReqDto,
  UpdateGrReqDto,
  GetGrsResDto,
  UpdateAvatarReqDto,
  ActivateGrPkgReqDto,
  GrPkgDto,
  CheckGrSUReqDto,
  GetGrDto,
  GetGrDto_Pkg,
  GetGrDto_Memb,
  kafkaTopic,
  UpdateChannelReqDto,
  BaseResDto,
  PaginationParams,
  GetGrDto_Bill,
  mapUserDtoToPopulateUserDto,
  ProjectionParams,
} from '@nyp19vp-be/shared';
import mongoose, { Types } from 'mongoose';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { Package, PackageDocument } from '../../schemas/package.schema';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
  Pagination,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { SoftDeleteModel } from 'mongoose-delete';
import { v4 } from 'uuid';
import { ClientKafka } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { firstValueFrom } from 'rxjs';
import { Bill, BillDocument } from '../../schemas/billing.schema';
import { BillCrudService } from '../bill-crud/bill-crud.service';

@Injectable()
export class GrCrudService implements OnModuleInit {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
    @Inject('PROD_MGMT_SERVICE') private readonly prodClient: ClientKafka,
    @InjectModel(Group.name) private grModel: SoftDeleteModel<GroupDocument>,
    @InjectModel(Package.name)
    private pkgModel: SoftDeleteModel<PackageDocument>,
    @InjectModel(Bill.name) private billModel: SoftDeleteModel<BillDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => BillCrudService))
    private billCrudService: BillCrudService,
  ) {}
  async onModuleInit() {
    this.prodClient.subscribeToResponseOf(kafkaTopic.PROD_MGMT.init);

    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }
  async create(createGrReqDto: CreateGrReqDto): Promise<BaseResDto> {
    console.log('pkg-mgmt-svc#create-group: ', createGrReqDto);
    const { user } = createGrReqDto.member;
    const listPkg = [];
    for (const elem of createGrReqDto.packages) {
      const pkg = await this.pkgModel.findById({ _id: elem._id });
      if (pkg) {
        for (let i = 0; i < elem.quantity; i++) {
          const grName = `${pkg.name.split(/\s+/).shift()}_${v4()}`;
          const newGr = new this.grModel({
            name: grName,
            members: [{ user: user, role: 'Super User' }],
            packages: [
              {
                package: {
                  _id: elem._id,
                  duration: elem.duration,
                  noOfMember: elem.noOfMember,
                },
                status: 'Not Activated',
              },
            ],
          });
          listPkg.push(newGr);
        }
      } else {
        throw new NotFoundException();
      }
    }
    return await this.grModel
      .insertMany(listPkg)
      .then((res) => {
        let flag = true;
        const forloop = async (_) => {
          for (const ele of res) {
            const eleRes = await firstValueFrom(
              this.prodClient.send(kafkaTopic.PROD_MGMT.init, ele._id),
            );
            if (eleRes != HttpStatus.CREATED) {
              flag = false;
              break;
            }
          }
        };
        if (flag) {
          return Promise.resolve({
            statusCode: HttpStatus.CREATED,
            message: `create groups successfully`,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async find(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    console.log('pkg-mgmt-svc#get-all-groups');
    const collector = new DocumentCollector<GroupDocument>(this.grModel);
    return await collector
      .find(collectionDto)
      .then((res) => {
        return Promise.resolve({
          data: res.data,
          pagination: res.pagination,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  async findById(projectionParams: ProjectionParams): Promise<GetGrResDto> {
    const { _id, proj } = projectionParams;
    console.log(`pkg-mgmt-svc#get-group #${_id}`);
    return this.grModel
      .findById({ _id: _id }, proj)
      .then(async (res) => {
        if (res) {
          if (proj.billing)
            res = await res.populate({ path: 'billing', model: 'Bill' });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get group #${_id} successfully`,
            group: await this.mapGrModelToGetGrDto(res),
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${_id} found`,
            error: 'NOT FOUND',
            group: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          group: null,
        });
      });
  }
  async findByUser(paginationParams: PaginationParams): Promise<GetGrsResDto> {
    const { user, role, sorter, limit, page, proj } = paginationParams;
    console.log(`pkg-mgmt-svc#get-groups-userId #${user}`);
    const query = { user: user };
    role != undefined ? (query['role'] = role) : null;
    const documentSkip = page == 0 ? 0 : page * limit;
    const pagination = await this.paginate(paginationParams, query);
    return await this.grModel
      .aggregate([
        { $match: { members: { $elemMatch: query } } },
        { $skip: documentSkip },
        { $limit: limit },
        { $sort: sorter },
        { $project: proj },
      ])
      .then(async (res) => {
        if (res) {
          const groups: GetGrDto[] = await Promise.all(
            res.map(async (gr) => {
              gr = await this.billModel.populate(gr, {
                path: 'billing',
              });
              return await this.mapGrModelToGetGrDto(gr);
            }),
          );
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get groups by userId #${user} successfully`,
            groups: groups,
            pagination: pagination,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group found by userId #${user}`,
            error: 'NOT FOUND',
            groups: null,
            pagination: pagination,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          groups: null,
          pagination: pagination,
        });
      });
  }
  private async paginate(params: PaginationParams, query): Promise<Pagination> {
    const count: number = await this.grModel.count(query);
    const pagination: Pagination = {
      total: count,
      page: params.page,
      limit: params.limit,
      next:
        (params.page + 1) * params.limit >= count ? undefined : params.page + 1,
      prev: params.page == 0 ? undefined : params.page - 1,
    };

    return pagination;
  }
  async mapGrModelToGetGrDto_Pkg(model): Promise<GetGrDto_Pkg[]> {
    if (model.packages) {
      const getGrDto_Pkgs: GetGrDto_Pkg[] = await Promise.all(
        model.packages.map(async (elem) => {
          const pkg: PackageDto = await this.pkgModel.findById(
            {
              _id: elem.package._id,
            },
            { name: 1, duration: 1, price: 1, noOfMember: 1, description: 1 },
          );
          pkg.duration = elem.package.duration;
          pkg.noOfMember = elem.package.noOfMember;
          const packages: GetGrDto_Pkg = {
            package: pkg,
            startDate: elem.startDate ? new Date(elem.startDate) : undefined,
            endDate: elem.endDate ? new Date(elem.endDate) : undefined,
            status:
              elem.startDate && elem.endDate
                ? setStatus(elem.startDate, elem.endDate)
                : 'Not activated',
          };
          return packages;
        }),
      );
      return getGrDto_Pkgs;
    }
    return undefined;
  }
  async mapGrModelToGetGrDto_Memb(model): Promise<GetGrDto_Memb[]> {
    if (model.members) {
      const getGrDto_Membs: GetGrDto_Memb[] = await Promise.all(
        model.members.map(async (elem) => {
          const user = await firstValueFrom(
            this.usersClient.send(
              kafkaTopic.USERS.GET_INFO_BY_ID,
              new ObjectId(elem.user),
            ),
          );
          const users: GetGrDto_Memb = {
            user: mapUserDtoToPopulateUserDto(user.user),
            role: elem.role,
            addedBy: elem.addedBy,
          };
          return users;
        }),
      );
      return getGrDto_Membs;
    }
    return undefined;
  }
  async mapGrModelToGetGrDto_Bill(model): Promise<GetGrDto_Bill[]> {
    if (model.billing) {
      return await this.billCrudService.mapBillModelToGetGrDto_Bill(model);
    }
    return undefined;
  }
  async mapGrModelToGetGrDto(model): Promise<GetGrDto> {
    const result: GetGrDto = {
      _id: model._id,
      name: model.name,
      avatar: model.avatar,
      channel: model.channel,
      billing: await this.mapGrModelToGetGrDto_Bill(model),
      todos: model.todos,
      packages: await this.mapGrModelToGetGrDto_Pkg(model),
      members: await this.mapGrModelToGetGrDto_Memb(model),
    };
    return result;
  }

  async update(updateGrReqDto: UpdateGrReqDto): Promise<BaseResDto> {
    const { _id } = updateGrReqDto;
    console.log(`pkg-mgmt-svc#update-group #${_id}'s name`);
    return await this.grModel
      .updateOne({ _id: _id }, { name: updateGrReqDto.name })
      .then(async (res) => {
        if (res.matchedCount && res.modifiedCount) {
          const data = await this.grModel.findById(_id, { name: 1 });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update group #${_id}'s name successfully`,
            data: data,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${_id} found`,
            error: 'NOT FOUND',
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`pkg-mgmt-svc#delete-group #${id}`);
    return await this.grModel
      .deleteById(id)
      .then(async (res) => {
        if (res) {
          const data = await this.grModel.findById(id).populate({
            path: 'packages',
            populate: {
              path: 'package',
              model: 'Package',
            },
          });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `delete group #${id} successfully`,
            data: data,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`pkg-mgmt-svc#Restore-deleted-group #${id}`);
    return await this.grModel
      .restore({ _id: id })
      .then(async (res) => {
        if (res) {
          const data = await this.grModel.findById(id).populate({
            path: 'packages',
            populate: {
              path: 'package',
              model: 'Package',
            },
          });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Restore deleted group #${id} successfully`,
            data: data,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async addMemb(updateGrMbReqDto: AddGrMbReqDto): Promise<BaseResDto> {
    const id = updateGrMbReqDto._id;
    const user_id = updateGrMbReqDto.user;
    console.log(`pkg-mgmt-svc#add-new-member #${user_id} to-group #${id}`);
    const { _id } = updateGrMbReqDto;
    return await this.grModel
      .findOne({ _id: _id }, { members: { $elemMatch: { user: user_id } } })
      .then(async (checkMemb) => {
        if (checkMemb) {
          if (!checkMemb.members.length) {
            return await this.grModel
              .updateOne(
                { _id: _id },
                {
                  $addToSet: {
                    members: {
                      user: user_id,
                      role: 'User',
                      addedBy: updateGrMbReqDto.addedBy,
                    },
                  },
                },
              )
              .then(async (res) => {
                if (res.matchedCount && res.modifiedCount) {
                  const data = await this.grModel.findById(_id, { members: 1 });
                  return Promise.resolve({
                    statusCode: HttpStatus.OK,
                    message: `add new member #${user_id} to group #${id} successfully`,
                    data: data,
                  });
                }
              })
              .catch((error) => {
                return Promise.resolve({
                  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                  message: error.message,
                });
              });
          } else {
            return Promise.resolve({
              statusCode: HttpStatus.CONFLICT,
              message: `DUPLICATE_KEY: User #${user_id} already exists`,
              error: 'DUPLICATE KEY ERROR',
            });
          }
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
        }
      });
  }
  async rmMemb(updateGrMbReqDto: RmGrMbReqDto): Promise<BaseResDto> {
    const id = updateGrMbReqDto._id;
    const user_id = updateGrMbReqDto.user;
    console.log(`pkg-mgmt-svc#remove-member #${user_id}-from-group #${id}`);
    const { _id } = updateGrMbReqDto;
    return await this.grModel
      .findOne({ _id: _id }, { members: { $elemMatch: { user: user_id } } })
      .then(async (checkExists) => {
        if (checkExists) {
          if (checkExists.members.length)
            if (checkExists.members[0].role != 'Super User') {
              return await this.grModel
                .updateOne(
                  { _id: _id },
                  { $pull: { members: { user: user_id } } },
                )
                .then(async (res) => {
                  if (res.matchedCount && res.modifiedCount) {
                    const data = await this.grModel.findById(_id, {
                      members: 1,
                    });
                    return Promise.resolve({
                      statusCode: HttpStatus.OK,
                      message: `remove member #${user_id} from group #${id} successfully`,
                      data: data,
                    });
                  }
                })
                .catch((error) => {
                  return Promise.resolve({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                  });
                });
            } else {
              return Promise.resolve({
                statusCode: HttpStatus.METHOD_NOT_ALLOWED,
                message: `Not allowed to remove Super User #${user_id} from group`,
                error: 'METHOD NOT ALLOWED',
              });
            }
          else {
            return Promise.resolve({
              statusCode: HttpStatus.NOT_FOUND,
              message: `No member #${user_id} found in group #${id}`,
              error: 'NOT FOUND',
            });
          }
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
        }
      });
  }
  async rmPkg(updateGrPkgReqDto: UpdateGrPkgReqDto): Promise<BaseResDto> {
    const id = updateGrPkgReqDto._id;
    console.log(`pkg-mgmt-svc#remove-package-from-group #${id}`);
    const { _id } = updateGrPkgReqDto;
    return await this.grModel
      .findByIdAndUpdate(
        { _id: _id },
        { $pull: { packages: updateGrPkgReqDto.package } },
      )
      .then(async (res) => {
        if (res) {
          const data = await this.grModel
            .findById(id, { packages: 1 })
            .populate({
              path: 'packages',
              populate: {
                path: 'package',
                model: 'Package',
              },
            });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `remove package from group #${id} successfully`,
            data: data,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
  async addPkg(updateGrPkgReqDto: UpdateGrPkgReqDto): Promise<BaseResDto> {
    const { _id, user } = updateGrPkgReqDto;
    console.log(`pkg-mgmt-svc#add-new-package-to-group #${_id}`);
    const grPkgs = await this.grModel.findOne(
      {
        _id: _id,
        packages: {
          $elemMatch: { status: 'Active' },
        },
      },
      { packages: 1 },
    );
    if (grPkgs) {
      const notAcitivatedPkg = grPkgs.packages.filter(
        (elem) => elem.status == 'Not Activated' || elem.status == 'Active',
      );
      const endDateArray = notAcitivatedPkg.map((x) => x.endDate);
      const start: Date = maxDate(endDateArray);
      const end: Date = addDays(start, updateGrPkgReqDto.package.duration);
      const pkg: GrPkgDto = {
        package: updateGrPkgReqDto.package,
        startDate: start,
        endDate: end,
        status: setStatus(start, end),
      };
      return await this.grModel
        .findByIdAndUpdate(
          {
            _id: _id,
            members: { $elemMatch: { user: user, role: 'Super User' } },
          },
          { $addToSet: { packages: pkg } },
        )
        .then(async (res) => {
          if (res) {
            const data = await this.grModel
              .findById(_id, { packages: 1 })
              .populate({
                path: 'packages',
                populate: {
                  path: 'package',
                  model: 'Package',
                },
              });
            return Promise.resolve({
              statusCode: HttpStatus.OK,
              message: `Renewed/upgraded package in group #${_id} successfully`,
              data: data,
            });
          } else {
            return Promise.resolve({
              statusCode: HttpStatus.UNAUTHORIZED,
              message: `Must be super user to renew/upgrade package`,
              error: 'UNAUTHORIZED',
            });
          }
        })
        .catch((error) => {
          return Promise.resolve({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
          });
        });
    } else {
      return Promise.resolve({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No group #${_id} found`,
        error: 'NOT FOUND',
      });
    }
  }
  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<BaseResDto> {
    const { _id, avatar } = updateAvatarReqDto;
    return await this.grModel
      .findByIdAndUpdate({ _id: _id }, { avatar: avatar })
      .then(async (res) => {
        const data = await this.grModel.findById(_id, { avatar: 1 });
        console.log(data);
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update group #${_id}'s avatar successfully`,
            data: data,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${_id} found`,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
  async updateChannel(
    updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<BaseResDto> {
    const { _id, channel } = updateChannelReqDto;
    return await this.grModel
      .findByIdAndUpdate({ _id: _id }, { channel: channel })
      .then(async (res) => {
        const data = await this.grModel.findById(_id, { channel: 1 });
        console.log(data);
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update group #${_id}'s avatar successfully`,
            data: data,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${_id} found`,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
  async activatePkg(
    activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<BaseResDto> {
    const { _id, user } = activateGrPkgReqDto;
    const activatedPkg = await this.grModel.findOne({
      _id: _id,
      packages: { $elemMatch: { status: 'Active' } },
    });
    if (!activatedPkg) {
      const start: Date = new Date();
      const end: Date = addDays(
        start,
        activateGrPkgReqDto.package.duration * 30,
      );
      return await this.grModel
        .findByIdAndUpdate(
          {
            _id: _id,
            package: {
              $elemMatch: {
                package: activateGrPkgReqDto.package,
                status: 'Not Activated',
              },
            },
            members: { $elemMatch: { user: user, role: 'Super User' } },
          },
          {
            $set: {
              'packages.$[].startDate': start,
              'packages.$[].endDate': end,
              'packages.$[].status': setStatus(start, end),
            },
          },
        )
        .then(async (res) => {
          const data = await this.grModel.findOne(
            {
              _id: _id,
              packages: {
                $elemMatch: { package: activateGrPkgReqDto.package },
              },
            },
            { packages: 1 },
          );
          if (res) {
            return Promise.resolve({
              statusCode: HttpStatus.OK,
              message: `Activated package #${activateGrPkgReqDto.package._id} in  group #${_id}`,
              data: data,
            });
          } else {
            return Promise.resolve({
              statusCode: HttpStatus.NOT_FOUND,
              message: `Group #${_id} not found`,
            });
          }
        })
        .catch((error) => {
          return Promise.resolve({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
          });
        });
    } else {
      return Promise.resolve({
        statusCode: HttpStatus.CONFLICT,
        message: 'Already have an activated package',
      });
    }
  }
  async isSU(checkGrSUReqDto: CheckGrSUReqDto): Promise<boolean> {
    const { _id, user } = checkGrSUReqDto;
    const isSU = await this.grModel.findOne({
      _id: _id,
      members: { $elemMatch: { user: user, role: 'Super User' } },
    });
    if (isSU) return true;
    return false;
  }
  async isGrU(_id: string, isGrUReqDto: string[]): Promise<boolean> {
    const group = await this.grModel.findOne({ _id: _id }, { members: 1 });
    const members = group.members.map((res) => {
      return res.user;
    });
    for (const elem of isGrUReqDto) {
      if (!members.includes(elem)) {
        return false;
      }
    }
    return true;
  }
}
const setStatus = (startDate: Date, endDate: Date): string => {
  const now = new Date();
  if (startDate > now) return 'Not Activated';
  else if (now < endDate) return 'Active';
  else return 'Expired';
};
const getDayDiff = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate);
  return convertMsToTime(endDate.getTime() - start.getTime());
};
function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${days}T${padTo2Digits(hours)}:${padTo2Digits(
    minutes,
  )}:${padTo2Digits(seconds)}`;
}
const addDays = (date: Date, days: number): Date => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const maxDate = (dates: Date[]) => new Date(Math.max(...dates.map(Number)));
