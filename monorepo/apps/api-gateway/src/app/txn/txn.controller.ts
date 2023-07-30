import {
  Controller,
  Post,
  Body,
  OnModuleInit,
  Inject,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TxnService } from './txn.service';
import {
  BaseResDto,
  CreateTransReqDto,
  TxnCollectionProperties,
  VNPIpnUrlReqDto,
  ZPCallbackReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from '../auth/guards/jwt.guard';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';
import { ATUser } from '../decorators/at-user.decorator';
import {
  CollectionDto,
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';

@ApiTags('Transaction')
@Controller('txn')
export class TxnController implements OnModuleInit {
  constructor(
    private readonly txnService: TxnService,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.txnClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.TXN);

    for (const key in kafkaTopic.TXN) {
      this.txnClient.subscribeToResponseOf(kafkaTopic.TXN[key]);
    }

    await Promise.all([this.txnClient.connect()]);
  }

  @Post('zalopay/stt')
  checkout(@Body() createTransReqDto: CreateTransReqDto): Promise<any> {
    console.log('Get Status', createTransReqDto);
    return this.txnService.zpGetStatus(createTransReqDto);
  }

  @Post('zalopay/callback')
  zpCallback(@Body() req) {
    console.log(req);
    let callbackReqDto: ZPCallbackReqDto;
    if (typeof req === 'object') callbackReqDto = req;
    else if (typeof req === 'string') callbackReqDto = JSON.parse(req);
    return this.txnService.zpCallback(callbackReqDto);
  }

  @Get('vnpay/vnpay_return')
  vnpCallback(@Query() req): Promise<BaseResDto> {
    console.log('Callback:', req);
    let vnpIpnUrlReqDto: VNPIpnUrlReqDto;
    if (typeof req === 'object') vnpIpnUrlReqDto = req;
    else if (typeof req === 'string') vnpIpnUrlReqDto = JSON.parse(req);
    return this.txnService.vnpCallback(vnpIpnUrlReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('user')
  findByUser(@ATUser() user: unknown): Promise<BaseResDto> {
    const user_id: string = user?.['userInfo']?.['_id'];
    console.log('Get transactions by user', user_id);
    return this.txnService.findByUser(user_id);
  }

  @Get()
  find(
    @Query(new ValidationPipe(TxnCollectionProperties))
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<CreateTransReqDto>> {
    console.log('get all transactions');
    console.log(collectionDto);
    return this.txnService.find(collectionDto);
  }
}
