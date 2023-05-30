import { Module } from '@nestjs/common';
import { ProdMgmtService } from './services/prod-mgmt.service';
import { ProdMgmtController } from './prod-mgmt.controller';
import { ProductService } from './services/products.service';

@Module({
  controllers: [ProdMgmtController],
  providers: [ProdMgmtService, ProductService],
})
export class ProdMgmtModule {}
