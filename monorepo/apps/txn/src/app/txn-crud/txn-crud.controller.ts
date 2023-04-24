import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { TxnCrudService } from './txn-crud.service';
import {
  CreateTransReqDto,
  CreateTransResDto,
  UpdateCartReqDto,
  ZPCheckoutResDto,
  ZPCreateOrderResDto,
  ZPDataCallback,
  kafkaTopic,
} from '@nyp19vp-be/shared';
@Controller()
export class TxnCrudController implements OnModuleInit {
  constructor(
    private readonly txnCrudService: TxnCrudService,
    @Inject('PKG_MGMT_SERVICE') private readonly pkgMgmtClient: ClientKafka,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.pkgMgmtClient.subscribeToResponseOf(
      kafkaTopic.HEALT_CHECK.PACKAGE_MGMT
    );
    for (const key in kafkaTopic.PACKAGE_MGMT) {
      this.pkgMgmtClient.subscribeToResponseOf(kafkaTopic.PACKAGE_MGMT[key]);
    }
    await Promise.all([this.pkgMgmtClient.connect()]);

    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }

  @MessagePattern(kafkaTopic.TXN.ZP_CREATE_ORD)
  async zpCheckout(
    @Payload() updateCartReqDto: UpdateCartReqDto
  ): Promise<ZPCheckoutResDto> {
    return await this.txnCrudService.zpCheckout(updateCartReqDto);
  }

  @MessagePattern(kafkaTopic.TXN.ZP_GET_STT)
  async zpGetStatus(
    @Payload() createTransReqDto: CreateTransReqDto
  ): Promise<CreateTransResDto> {
    return await this.txnCrudService.zpGetStatus(createTransReqDto);
  }

  @MessagePattern(kafkaTopic.TXN.ZP_CREATE_TRANS)
  async zpCreateTrans(
    @Payload() zpDataCallback: ZPDataCallback
  ): Promise<CreateTransResDto> {
    return await this.txnCrudService.zpCreateTrans(zpDataCallback);
  }
}
