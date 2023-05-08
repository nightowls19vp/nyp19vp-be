import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to auth/auth!"', () => {
      const appController = app.get<AuthController>(AuthController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to auth/auth!',
      });
    });
  });
});
