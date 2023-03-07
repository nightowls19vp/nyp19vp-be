import { AuthenticationModule } from './authentication/authentication.module';
import { DataBaseModule } from '../core/database/database.module';

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthenticationModule, DataBaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
