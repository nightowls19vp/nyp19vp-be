import { Controller, Post, Req } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';
import { ZPCallbackReqDto, ZPCallbackResDto } from '@nyp19vp-be/shared';

@Controller('zalopay')
export class ZalopayController {
  constructor(private readonly zalopayService: ZalopayService) {}

  @Post('/callback')
  callback(@Req() callbackReqDto: ZPCallbackReqDto): Promise<ZPCallbackResDto> {
    return this.zalopayService.callback(callbackReqDto);
  }
}
