import { Controller, Get, Param } from '@nestjs/common';
import { WardsService } from './wards.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('divisions')
@Controller('w')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  findAll() {
    return this.wardsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.wardsService.findOne(+code);
  }
}
