import { Test, TestingModule } from '@nestjs/testing';
import { GrCrudController } from './gr-crud.controller';
import { GrCrudService } from './gr-crud.service';

describe('GrCrudController', () => {
  let controller: GrCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrCrudController],
      providers: [GrCrudService],
    }).compile();

    controller = module.get<GrCrudController>(GrCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
