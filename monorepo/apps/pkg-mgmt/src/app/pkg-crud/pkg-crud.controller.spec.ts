import { Test, TestingModule } from '@nestjs/testing';
import { PkgCrudController } from './pkg-crud.controller';
import { PkgCrudService } from './pkg-crud.service';

describe('PkgCrudController', () => {
  let controller: PkgCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PkgCrudController],
      providers: [PkgCrudService],
    }).compile();

    controller = module.get<PkgCrudController>(PkgCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
