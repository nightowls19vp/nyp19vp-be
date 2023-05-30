import {
  PkgMgmtInitReqDto,
  PkgMgmtInitResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/groups';
import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GroupEntity } from '../entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,
  ) {}

  async init(data: PkgMgmtInitReqDto): Promise<PkgMgmtInitResDto> {
    const group = await this.groupRepo.findOne({
      where: { groupMongoId: data.groupMongoId },
    });

    if (!group) {
      const newGroup = this.groupRepo.create({
        groupMongoId: data.groupMongoId,
      });

      await this.groupRepo.save(newGroup);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create new group successfully',
        data: newGroup,
      };
    }
  }
}
