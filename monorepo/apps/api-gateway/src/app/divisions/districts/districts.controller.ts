import { Controller, Get, Param } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('divisions')
@Controller('d')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}
  @Get()
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(+id);
  }
}
