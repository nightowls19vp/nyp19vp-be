import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

import { DivisionsService } from './divisions.service';
import { ProvinceService } from './province/province.service';
import { DistrictService } from './district/district.service';
import { WardService } from './ward/ward.service';

@Controller()
export class DivisionsController {
  constructor(
    private readonly divisionsService: DivisionsService,

    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private readonly wardService: WardService,
  ) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.provinces.findAll)
  findAllProvinces() {
    return this.provinceService.findAll();
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.provinces.findByCode)
  findProvinceByCode(code: number) {
    console.log('findProvinceByCode', code);

    return this.provinceService.findByCode(code);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.provinces.search)
  searchProvinces(q: string) {
    console.log('searchProvinces', q);

    return this.provinceService.search(q);
  }
}
