import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { WardsService } from './wards.service';

@ApiTags('divisions')
@Controller('w')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @ApiQuery({
    name: 'q',
    required: false,
    description:
      'Search by name of the province, pass `%` or let empty to get all wards',
  })
  @ApiQuery({
    name: 'd',
    required: true,
    description: 'Search wards by district code',
  })
  @Get()
  search(@Query('q') q: string, @Query('d') d: string) {
    return this.wardsService.search(q || '%', d);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.wardsService.findByCode(+code);
  }
}
