import { Module } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';
import { ZalopayController } from './zalopay.controller';
import { zpconfig } from '../core/config/zalopay.config';

@Module({
  controllers: [ZalopayController],
  providers: [
    ZalopayService,
    { provide: 'ZALOPAY_CONFIG', useValue: zpconfig },
  ],
})
export class ZalopayModule {}
