import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('divisions')
@Controller('p')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}
  @Get()
  findAll() {
    return this.provincesService.findAll();
  }

  @ApiQuery({ name: 'q', required: true })
  @Get('search')
  search(@Query('q') q: string) {
    return this.provincesService.search(q);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.provincesService.findByCode(+code);
  }
}
