import { Test } from '@nestjs/testing';

import { AuthService } from '../services/auth.service';

describe('AppService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  describe('getData', () => {
    it('should return "Welcome to auth/auth!"', () => {
      expect(service.getData()).toEqual({ message: 'Welcome to auth/auth!' });
    });
  });
});
