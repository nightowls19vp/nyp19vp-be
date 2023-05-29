import { Module } from '@nestjs/common';
import { GroupsProductsService } from './groups-products.service';
import { GroupsProductsController } from './groups-products.controller';

@Module({
  controllers: [GroupsProductsController],
  providers: [GroupsProductsService],
})
export class GroupsProductsModule {}
