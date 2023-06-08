/* eslint-disable prefer-const */
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateGrReqDto,
  CreateGrResDto,
  GetGrResDto,
  GroupDto,
  PackageDto,
  AddGrMbReqDto,
  RmGrMbReqDto,
  UpdateGrMbResDto,
  UpdateGrPkgReqDto,
  UpdateGrPkgResDto,
  UpdateGrReqDto,
  UpdateGrResDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  ActivateGrPkgReqDto,
  ActivateGrPkgResDto,
  GrPkgDto,
  CheckGrSUReqDto,
  GetGrDto,
  GetGrDto_Pkg,
  GetGrDto_Memb,
  UserDto,
  kafkaTopic,
  UpdateChannelReqDto,
  UpdateChannelResDto,
  GetGrChannelResDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { Package, PackageDocument } from '../../schemas/package.schema';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { SoftDeleteModel } from 'mongoose-delete';
import { v4 } from 'uuid';
import { ClientKafka } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GrCrudService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
    @InjectModel(Group.name) private grModel: SoftDeleteModel<GroupDocument>,
    @InjectModel(Package.name)
    private pkgModel: SoftDeleteModel<PackageDocument>,
  ) {}
  async createGr(createGrReqDto: CreateGrReqDto): Promise<CreateGrResDto> {
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
      .then(() => {
        return Promise.resolve({
          statusCode: HttpStatus.CREATED,
          message: `create groups successfully`,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async findAllGrs(
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

  async findGrById(id: Types.ObjectId): Promise<GetGrResDto> {
    console.log(`pkg-mgmt-svc#get-group #${id}`);
    return this.grModel
      .findById({ _id: id })
      .then(async (res) => {
        if (res) {
          const getGrDto_Pkgs: GetGrDto_Pkg[] = await Promise.all(
            res.packages.map(async (elem) => {
              const pkg: PackageDto = await this.pkgModel.findById({
                _id: elem.package._id,
              });
              pkg.duration = elem.package.duration;
              pkg.noOfMember = elem.package.noOfMember;
              const packages: GetGrDto_Pkg = {
                package: pkg,
                startDate: elem.startDate
                  ? new Date(elem.startDate)
                  : undefined,
                endDate: elem.endDate ? new Date(elem.endDate) : undefined,
                status:
                  elem.startDate && elem.endDate
                    ? setStatus(elem.startDate, elem.endDate)
                    : 'Not activated',
              };
              return packages;
            }),
          );
          const getGrDto_Membs: GetGrDto_Memb[] = await Promise.all(
            res.members.map(async (elem) => {
              const user: UserDto = await firstValueFrom(
                this.usersClient.send(
                  kafkaTopic.USERS.GET_INFO_BY_ID,
                  new ObjectId(elem.user),
                ),
              );
              const users: GetGrDto_Memb = {
                user: user,
                role: elem.role,
                addedBy: elem.addedBy,
              };
              return users;
            }),
          );
          const group = mapGrSchemaToGetGrDto(
            res,
            getGrDto_Pkgs,
            getGrDto_Membs,
          );
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get group #${id} successfully`,
            group: group,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
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
  getGrByUserId(memberDto: MemberDto): Promise<GetGrsByUserResDto> {
    const { user, role } = memberDto;
    console.log(`pkg-mgmt-svc#get-groups-userId #${user}`);
    const query = { user: user };
    role != 'All' ? (query['role'] = role) : null;

    return this.grModel
      .find({ members: { $elemMatch: query } })
      .then(async (res) => {
        if (res) {
          const groups: GetGrDto[] = await Promise.all(
            res.map(async (gr) => {
              const getGrDto_Pkgs: GetGrDto_Pkg[] = await Promise.all(
                gr.packages.map(async (elem) => {
                  const pkg: PackageDto = await this.pkgModel.findById({
                    _id: elem.package._id,
                  });
                  pkg.duration = elem.package.duration;
                  pkg.noOfMember = elem.package.noOfMember;
                  const packages: GetGrDto_Pkg = {
                    package: pkg,
                    startDate: elem.startDate
                      ? new Date(elem.startDate)
                      : undefined,
                    endDate: elem.endDate ? new Date(elem.endDate) : undefined,
                    status:
                      elem.startDate && elem.endDate
                        ? setStatus(elem.startDate, elem.endDate)
                        : 'Not activated',
                  };
                  return packages;
                }),
              );
              const getGrDto_Membs: GetGrDto_Memb[] = await Promise.all(
                gr.members.map(async (elem) => {
                  const user: UserDto = await firstValueFrom(
                    this.usersClient.send(
                      kafkaTopic.USERS.GET_INFO_BY_ID,
                      new ObjectId(elem.user),
                    ),
                  );
                  const users: GetGrDto_Memb = {
                    user: user,
                    role: elem.role,
                    addedBy: elem.addedBy,
                  };
                  return users;
                }),
              );
              const group = mapGrSchemaToGetGrDto(
                gr,
                getGrDto_Pkgs,
                getGrDto_Membs,
              );
              return group;
            }),
          );
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get groups by userId #${user} successfully`,
            groups: groups,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group found by userId #${user}`,
            error: 'NOT FOUND',
            groups: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          groups: null,
        });
      });
  }

  async updateGr(updateGrReqDto: UpdateGrReqDto): Promise<UpdateGrResDto> {
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

  async removeGr(id: Types.ObjectId): Promise<CreateGrResDto> {
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

  async restoreGr(id: Types.ObjectId): Promise<CreateGrResDto> {
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

  async addMemb(updateGrMbReqDto: AddGrMbReqDto): Promise<UpdateGrMbResDto> {
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
  async rmMemb(updateGrMbReqDto: RmGrMbReqDto): Promise<UpdateGrMbResDto> {
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
  async rmGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
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
  async addGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
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
        (elem) => elem.status == 'Not Activated',
      );
      const endDateArray = notAcitivatedPkg.map((x) => x.endDate);
      console.log(notAcitivatedPkg);
      const start: Date = maxDate(endDateArray);
      console.log(start);
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
  ): Promise<UpdateAvatarResDto> {
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
  ): Promise<UpdateChannelResDto> {
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
  async activateGrPkg(
    activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<ActivateGrPkgResDto> {
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
              message: 'Group not found',
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
  async getGrChannelByUserId(id: Types.ObjectId): Promise<GetGrChannelResDto> {
    return await this.grModel
      .find({ members: { $elemMatch: { user: id } } }, { channel: 1 })
      .then((res) => {
        if (res) {
          console.log(res);
          const channels = res.map((group) => {
            return group.channel;
          });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get group channels by userId #${id} successfully`,
            channels: channels,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group found by userId #${id}`,
            error: 'NOT FOUND',
            channels: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
          channels: null,
        });
      });
  }
  async checkGrSU(checkGrSUReqDto: CheckGrSUReqDto): Promise<boolean> {
    const { _id, user } = checkGrSUReqDto;
    const isSU = await this.grModel.findOne({
      _id: _id,
      members: { $elemMatch: { user: user, role: 'Super User' } },
    });
    if (isSU) return true;
    return false;
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
const mapGrSchemaToGetGrDto = (
  model: any,
  packages: GetGrDto_Pkg[],
  members: GetGrDto_Memb[],
): GetGrDto => {
  const result: GetGrDto = {
    _id: model._id,
    name: model.name,
    avatar: model.avatar,
    channel: model.channel,
    packages: packages,
    members: members,
  };
  return result;
};
const maxDate = (dates: Date[]) => new Date(Math.max(...dates.map(Number)));
