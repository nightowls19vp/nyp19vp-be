/* eslint-disable prefer-const */
import { HttpStatus, Injectable } from '@nestjs/common';
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
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { Package, PackageDocument } from '../../schemas/package.schema';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ObjectId } from 'mongodb';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class GrCrudService {
  constructor(
    @InjectModel(Group.name) private grModel: SoftDeleteModel<GroupDocument>,
    @InjectModel(Package.name)
    private pkgModel: SoftDeleteModel<PackageDocument>
  ) {}
  async createGr(createGrReqDto: CreateGrReqDto): Promise<CreateGrResDto> {
    console.log('pkg-mgmt-svc#create-group: ', createGrReqDto);
    const pkgId: ObjectId = new ObjectId(createGrReqDto.package.packageId);
    const start: Date = createGrReqDto.package.startDate;
    const pkg = await this.pkgModel.findById(
      { _id: pkgId, deletedAt: null },
      { duration: 1, _id: 0 }
    );
    const end: Date = addDays(start, pkg.duration);
    const newGr = new this.grModel({
      name: createGrReqDto.name,
      members: [
        {
          user: createGrReqDto.member.user,
          role: 'Super User',
        },
      ],
      packages: [
        {
          package: pkgId,
          startDate: new Date(start),
          endDate: end,
          remainingTime: getDayDiff(new Date(), end),
          status: setStatus(start, end),
        },
      ],
    });
    return await newGr
      .save()
      .then(() => {
        return Promise.resolve({
          statusCode: HttpStatus.CREATED,
          message: `create user #${createGrReqDto.name} successfully`,
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
    collectionDto: CollectionDto
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
      .populate({
        path: 'packages',
        populate: {
          path: 'package',
          model: 'Package',
        },
      })
      .exec()
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get group #${id} successfully`,
            group: mapGrSchemaToGrDto(res),
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
            group: mapGrSchemaToGrDto(res),
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          group: null,
        });
      });
  }

  async updateGr(updateGrReqDto: UpdateGrReqDto): Promise<UpdateGrResDto> {
    const { _id } = updateGrReqDto;
    console.log(`pkg-mgmt-svc#update-group #${_id}'s name`);
    return await this.grModel
      .updateOne({ _id: _id }, { name: updateGrReqDto.name })
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update group #${_id}'s name successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${_id} found`,
            error: 'NOT FOUND',
          });
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
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `delete group #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
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
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Restore deleted group #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
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
      .findById({ _id: _id }, { members: { $elemMatch: { user: user_id } } })
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
                }
              )
              .then((res) => {
                if (res.matchedCount && res.modifiedCount)
                  return Promise.resolve({
                    statusCode: HttpStatus.OK,
                    message: `add new member #${user_id} to group #${id} successfully`,
                  });
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
      .findById({ _id: _id }, { members: { $elemMatch: { user: user_id } } })
      .then(async (checkExists) => {
        if (checkExists) {
          if (checkExists.members.length)
            if (checkExists.members[0].role != 'Super User') {
              return await this.grModel
                .updateOne(
                  { _id: _id },
                  { $pull: { members: { user: user_id } } }
                )
                .then((res) => {
                  if (res.matchedCount && res.modifiedCount)
                    return Promise.resolve({
                      statusCode: HttpStatus.OK,
                      message: `remove member #${user_id} from group #${id} successfully`,
                    });
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
    updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    const id = updateGrPkgReqDto._id;
    console.log(`pkg-mgmt-svc#remove-package-from-group #${id}`);
    const { _id } = updateGrPkgReqDto;
    return await this.grModel
      .findByIdAndUpdate(
        { _id: _id },
        { $pull: { packages: updateGrPkgReqDto.package } }
      )
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `remove package from group #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
  async addGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    const id = updateGrPkgReqDto._id;
    console.log(`pkg-mgmt-svc#add-new-package-to-group #${id}`);
    const { _id } = updateGrPkgReqDto;
    return await this.grModel
      .findByIdAndUpdate(
        { _id: _id },
        { $pull: { packages: updateGrPkgReqDto.package } }
      )
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `add new package to group #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No group #${id} found`,
            error: 'NOT FOUND',
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
}
const setStatus = (startDate: Date, endDate: Date): string => {
  const now = new Date();
  if (startDate > now) return 'Not Activate';
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
    minutes
  )}:${padTo2Digits(seconds)}`;
}
const addDays = (date: Date, days: number): Date => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const mapGrSchemaToGrDto = (model: any): GroupDto => {
  let packages = [];
  for (const ele of model.packages) {
    const pkg: PackageDto = ele.package;
    packages.push(pkg);
  }
  let result = new GroupDto();
  result.name = model.name;
  result.packages = model.packages;
  result.members = model.members;
  return result;
};
