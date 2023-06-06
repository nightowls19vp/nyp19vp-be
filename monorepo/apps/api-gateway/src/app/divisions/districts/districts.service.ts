import { Injectable } from '@nestjs/common';

@Injectable()
export class DistrictsService {
  findAll() {
    return `This action returns all districts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }
}
