import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TxnCrudService } from './txn-crud.service';
import {
  UpdateCartReqDto,
  UpdateCartResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Observable } from 'rxjs';
@Controller()
export class TxnCrudController {
  constructor(private readonly txnCrudService: TxnCrudService) {}

  @MessagePattern(kafkaTopic.TXN.CHECKOUT)
  checkout(@Payload() updateCartReqDto: UpdateCartReqDto): Promise<any> {
    return this.txnCrudService.checkout(updateCartReqDto);
  }
}
