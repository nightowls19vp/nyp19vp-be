import { Module } from '@nestjs/common';
import { FDLogger } from './logger.service';

@Module({
  providers: [FDLogger],
  exports: [FDLogger],
})
export class LoggerModule {}
