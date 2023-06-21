import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillCrudService } from './bill-crud.service';
import {
  BaseResDto,
  CreateBillReqDto,
  UpdateBillReqDto,
  UpdateBillSttReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';

@Controller()
export class BillCrudController {
  constructor(private readonly billCrudService: BillCrudService) {}

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.CREATE)
  createBill(
    @Payload() createBillReqDto: CreateBillReqDto,
  ): Promise<BaseResDto> {
    return this.billCrudService.createBill(createBillReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.GET)
  getBill(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.billCrudService.getBill(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE)
  updateBill(
    @Payload() updateBillReqDto: UpdateBillReqDto,
  ): Promise<BaseResDto> {
    return this.billCrudService.updateBill(updateBillReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE_STT)
  updateBillStt(
    @Payload() updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    return this.billCrudService.updateBillStt(updateBillSttReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.DELETE)
  rmBill(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.billCrudService.rmBill(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.BILL.RESTORE)
  restoreBill(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.billCrudService.restoreBill(id);
  }
}
