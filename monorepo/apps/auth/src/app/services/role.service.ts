import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  getData(): { message: string } {
    return { message: 'Welcome to auth/Role!' };
  }
}
