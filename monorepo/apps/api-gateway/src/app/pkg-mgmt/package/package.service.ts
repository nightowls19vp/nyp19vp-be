import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BaseResDto,
  CreatePkgReqDto,
  GetPkgResDto,
  PackageDto,
  UpdatePkgReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PackageService implements OnModuleInit {
  constructor(
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka,
  ) {}
  onModuleInit() {
    const pkgTopics = Object.values(kafkaTopic.PKG_MGMT.PACKAGE);

    for (const topic of pkgTopics) {
      this.packageMgmtClient.subscribeToResponseOf(topic);
    }
  }
  async create(createPkgReqDto: CreatePkgReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PKG_MGMT.PACKAGE.CREATE,
        JSON.stringify(createPkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.CREATED) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }

  async find(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<PackageDto>> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PKG_MGMT.PACKAGE.GET,
        collectionDto,
      ),
    );
  }
  async findById(id: Types.ObjectId): Promise<GetPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PKG_MGMT.PACKAGE.GET_BY_ID, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async update(updatePkgReqDto: UpdatePkgReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PKG_MGMT.PACKAGE.UPDATE,
        JSON.stringify(updatePkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PKG_MGMT.PACKAGE.DELETE, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PKG_MGMT.PACKAGE.RESTORE, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
}
