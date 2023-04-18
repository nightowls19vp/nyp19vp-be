import { Controller, Get, Post, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { ZPCallbackReqDto, ZPCallbackResDto } from '@nyp19vp-be/shared';

@Controller()
export class AppController {
  zalopayService: any;
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
  @Post('/callback')
  callback(@Req() callbackReqDto: ZPCallbackReqDto): Promise<ZPCallbackResDto> {
    return this.appService.callback(callbackReqDto);
  }
}
