import { Injectable } from '@nestjs/common';

@Injectable()
export class WardsService {
  findAll() {
    return `This action returns all wards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ward`;
  }
}
