import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TxnCrudService } from './txn-crud.service';
import {
  UpdateCartReqDto,
  ZPCreateOrderResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
@Controller()
export class TxnCrudController {
  constructor(private readonly txnCrudService: TxnCrudService) {}

  @MessagePattern(kafkaTopic.TXN.CHECKOUT)
  checkout(
    @Payload() updateCartReqDto: UpdateCartReqDto
  ): Promise<ZPCreateOrderResDto> {
    return this.txnCrudService.checkout(updateCartReqDto);
  }
}
