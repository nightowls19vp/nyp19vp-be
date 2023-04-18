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
  async checkout(
    @Payload() updateCartReqDto: UpdateCartReqDto
  ): Promise<ZPCreateOrderResDto> {
    console.log('xxxx');
    return await this.txnCrudService.checkout(updateCartReqDto);
  }
}
