import { Test, TestingModule } from '@nestjs/testing';
import { UsersCrudController } from './users-crud.controller';
import { UsersCrudService } from './users-crud.service';

describe('UsersCrudController', () => {
  let controller: UsersCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersCrudController],
      providers: [UsersCrudService],
    }).compile();

    controller = module.get<UsersCrudController>(UsersCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
