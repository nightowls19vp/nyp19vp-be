import { Injectable } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class DbService {
  constructor() {
    log('heloooooooooooo');
  }
}
