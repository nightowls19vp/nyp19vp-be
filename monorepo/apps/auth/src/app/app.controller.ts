import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';

import { kafkaTopic, LoginResDto } from '@nyp19vp-be/shared';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern(kafkaTopic.HEALT_CHECK.AUTH)
  healthcheck() {
    return 'ok  ';
  }
}
