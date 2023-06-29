import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillCrudService } from './bill-crud.service';
import {
  BaseResDto,
  CreateBillReqDto,
  GetBillResDto,
  UpdateBillReqDto,
  UpdateBillSttReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';

@Controller()
export class BillCrudController {
  constructor(private readonly billCrudService: BillCrudService) {}

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.CREATE)
  create(@Payload() createBillReqDto: CreateBillReqDto): Promise<BaseResDto> {
    return this.billCrudService.create(createBillReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.GET_BY_ID)
  findById(@Payload() id: Types.ObjectId): Promise<GetBillResDto> {
    return this.billCrudService.findById(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE)
  update(@Payload() updateBillReqDto: UpdateBillReqDto): Promise<BaseResDto> {
    return this.billCrudService.update(updateBillReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE_STT)
  updateStt(
    @Payload() updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    return this.billCrudService.updateStt(updateBillSttReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.DELETE)
  remove(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.billCrudService.remove(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.RESTORE)
  restore(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.billCrudService.restore(id);
  }
}
