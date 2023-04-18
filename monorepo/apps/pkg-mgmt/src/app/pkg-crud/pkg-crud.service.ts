import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreatePkgReqDto,
  CreatePkgResDto,
  GetPkgResDto,
  IdDto,
  PackageDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
} from '@nyp19vp-be/shared';
import { Model, Types } from 'mongoose';
import { Package, PackageDocument } from '../../schemas/package.schema';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';

@Injectable()
export class PkgCrudService {
  constructor(
    @InjectModel(Package.name) private pkgModel: Model<PackageDocument>
  ) {}
  async createPkg(createPkgReqDto: CreatePkgReqDto): Promise<CreatePkgResDto> {
    console.log('pkg-mgmt-svc#create-package: ', createPkgReqDto);
    const newPkg = new this.pkgModel({
      name: createPkgReqDto.name,
      duration: createPkgReqDto.duration,
      price: createPkgReqDto.price,
      noOfMember: createPkgReqDto.noOfMember,
      description: createPkgReqDto.description,
      createdBy: createPkgReqDto.createdBy,
    });
    return await newPkg
      .save()
      .then(() => {
        return Promise.resolve({
          statusCode: HttpStatus.CREATED,
          message: `create user #${createPkgReqDto.name} successfully`,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async findAllPkgs(
    collectionDto: CollectionDto
  ): Promise<CollectionResponse<PackageDto>> {
    console.log('pkg-mgmt-svc#get-all-packages');
    const collector = new DocumentCollector<PackageDocument>(this.pkgModel);
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

  async findPkgById(id: Types.ObjectId): Promise<GetPkgResDto> {
    console.log(`pkg-mgmt-svc#get-package #${id}`);
    return await this.pkgModel
      .findById({ _id: id, deletedAt: null })
      .exec()
      .then((res) => {
        console.log(res);
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get package #${id} successfully`,
            package: res,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No package #${id} found`,
            error: 'NOT FOUND',
            package: res,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          package: null,
        });
      });
  }

  async updatePkg(updatePkgReqDto: UpdatePkgReqDto): Promise<UpdatePkgResDto> {
    const id = updatePkgReqDto._id;
    console.log(`pkg-mgmt-svc#update-package #${id}`);
    const { _id } = updatePkgReqDto;
    return await this.pkgModel
      .updateOne(
        { _id: _id, deletedAt: null },
        {
          name: updatePkgReqDto.name,
          duration: updatePkgReqDto.duration,
          price: updatePkgReqDto.price,
          noOfMember: updatePkgReqDto.noOfMember,
          description: updatePkgReqDto.description,
          updatedBy: updatePkgReqDto.updatedBy,
        }
      )
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get package #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No package #${id} found`,
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

  async removePkg(id: Types.ObjectId): Promise<CreatePkgResDto> {
    console.log(`pkg-mgmt-svc#delete-package #${id}`);
    return await this.pkgModel
      .updateOne({ _id: id, deletedAt: null }, { deletedAt: new Date() })
      .exec()
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `delete package #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No package #${id} found`,
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

  async findManyPkg(list_id: IdDto[]): Promise<PackageDto[]> {
    const res = await this.pkgModel.find({ _id: { $in: list_id } }).exec();
    console.log(res);
    return res;
  }
}
