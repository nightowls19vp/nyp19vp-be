import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TxnCrudService } from './txn-crud.service';
import {
  BaseResDto,
  CheckoutReqDto,
  CreateTransReqDto,
  VNPIpnUrlReqDto,
  ZPCheckoutResDto,
  ZPDataCallback,
  kafkaTopic,
} from '@nyp19vp-be/shared';
@Controller()
export class TxnCrudController {
  constructor(private readonly txnCrudService: TxnCrudService) {}

  @MessagePattern(kafkaTopic.TXN.ZP_CREATE_ORD)
  async zpCheckout(
    @Payload() checkoutReqDto: CheckoutReqDto,
  ): Promise<ZPCheckoutResDto> {
    return await this.txnCrudService.zpCheckout(checkoutReqDto);
  }

  @MessagePattern(kafkaTopic.TXN.ZP_GET_STT)
  async zpGetStatus(
    @Payload() createTransReqDto: CreateTransReqDto,
  ): Promise<BaseResDto> {
    return await this.txnCrudService.zpGetStatus(createTransReqDto);
  }

  @MessagePattern(kafkaTopic.TXN.ZP_CREATE_TRANS)
  async zpCreateTrans(
    @Payload() zpDataCallback: ZPDataCallback,
  ): Promise<BaseResDto> {
    return await this.txnCrudService.zpCreateTrans(zpDataCallback);
  }

  @MessagePattern(kafkaTopic.TXN.VNP_CREATE_ORD)
  async vnpCreateOrder(
    @Payload() checkoutReqDto: CheckoutReqDto,
  ): Promise<BaseResDto> {
    return await this.txnCrudService.vnpCreateOrder(checkoutReqDto);
  }

  @MessagePattern(kafkaTopic.TXN.VNP_CALLBACK)
  async vnpCallback(
    @Payload() vnpIpnUrlReqDto: VNPIpnUrlReqDto,
  ): Promise<BaseResDto> {
    return await this.txnCrudService.vnpCallback(vnpIpnUrlReqDto);
  }
}
