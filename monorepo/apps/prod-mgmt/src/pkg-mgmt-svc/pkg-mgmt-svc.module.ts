import { Module } from '@nestjs/common';
import { PkgMgmtSvcService } from './pkg-mgmt-svc.service';
import { PkgMgmtSvcController } from './pkg-mgmt-svc.controller';

@Module({
  controllers: [PkgMgmtSvcController],
  providers: [PkgMgmtSvcService],
})
export class PkgMgmtSvcModule {}
