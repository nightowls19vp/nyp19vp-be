/* eslint-disable prefer-const */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateGrReqDto,
  CreateGrResDto,
  GetGrResDto,
  GetGrsResDto,
  GroupDto,
  PackageDto,
  UpdateGrMbReqDto,
  UpdateGrMbResDto,
  UpdateGrPkgReqDto,
  UpdateGrPkgResDto,
  UpdateGrReqDto,
  UpdateGrResDto,
} from '@nyp19vp-be/shared';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { ObjectId } from 'mongodb';
import { Package, PackageDocument } from '../../schemas/package.schema';

@Injectable()
export class GrCrudService {
  constructor(
    @InjectModel(Group.name) private grModel: Model<GroupDocument>,
    @InjectModel(Package.name) private pkgModel: Model<PackageDocument>
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
    const newPkg = new this.grModel({
      name: createGrReqDto.name,
      members: createGrReqDto.member,
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
    return await newPkg
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

  async findAllGrs(): Promise<GetGrsResDto> {
    console.log('pkg-mgmt-svc#get-all-groups');
    return await this.grModel
      .find({ deletedAt: null })
      .populate({
        path: 'packages',
        populate: { path: 'package', model: 'Package' },
      })
      .exec()
      .then((res) => {
        let grs = [];
        for (const ele of res) {
          grs.push(mapGrSchemaToGrDto(ele));
        }
        if (grs.length) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: 'get all groups successfully',
            groups: grs,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No groups found',
            error: 'NOT FOUND',
            groups: grs,
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

  async findGrById(id: string): Promise<GetGrResDto> {
    console.log(`pkg-mgmt-svc#get-group #${id}`);
    const _id: ObjectId = new ObjectId(id);
    return this.grModel
      .findOne({
        _id: _id,
        deletedAt: null,
      })
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

  async updateGr(
    id: string,
    updateGrReqDto: UpdateGrReqDto
  ): Promise<UpdateGrResDto> {
    const _id: ObjectId = new ObjectId(id);
    console.log(`pkg-mgmt-svc#update-group #${id}'s name`);
    return await this.grModel
      .updateOne({ _id: _id, deletedAt: null }, { name: updateGrReqDto.name })
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update group #${id}'s name successfully`,
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

  async removeGr(id: string): Promise<CreateGrResDto> {
    console.log(`pkg-mgmt-svc#delete-group #${id}`);
    const _id: ObjectId = new ObjectId(id);
    return await this.grModel
      .updateOne({ _id: _id, deletedAt: null }, { deletedAt: new Date() })
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
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
  async addMemb(updateGrMbReqDto: UpdateGrMbReqDto): Promise<UpdateGrMbResDto> {
    const id = updateGrMbReqDto._id;
    console.log(`pkg-mgmt-svc#add-new-member-to-group #${id}`);
    const _id: ObjectId = new ObjectId(id);
    return await this.grModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { $addToSet: { members: updateGrMbReqDto.member } }
      )
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `add new member to group #${id} successfully`,
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
  async rmMemb(updateGrMbReqDto: UpdateGrMbReqDto): Promise<UpdateGrMbResDto> {
    const id = updateGrMbReqDto._id;
    console.log(`pkg-mgmt-svc#remove-member-from-group #${id}`);
    const _id: ObjectId = new ObjectId(id);
    return await this.grModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { $pull: { members: updateGrMbReqDto.member } }
      )
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `remove member from group #${id} successfully`,
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
  async rmGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    const id = updateGrPkgReqDto._id;
    console.log(`pkg-mgmt-svc#remove-package-from-group #${id}`);
    const _id: ObjectId = new ObjectId(id);
    return await this.grModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { $pull: { packages: updateGrPkgReqDto.package } }
      )
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
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
    const _id: ObjectId = new ObjectId(id);
    return await this.grModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { $pull: { packages: updateGrPkgReqDto.package } }
      )
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
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
