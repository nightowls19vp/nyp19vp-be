import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsService } from './groups.service';
import { kafkaTopic } from '@nyp19vp-be/shared';
import { PkgMgmtInitReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/groups';

@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.init)
  async init(@Payload() data: PkgMgmtInitReqDto) {
    return await this.groupsService.init(data);
  }
}
