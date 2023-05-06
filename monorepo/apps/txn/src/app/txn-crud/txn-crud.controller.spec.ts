import { Test, TestingModule } from '@nestjs/testing';
import { TxnCrudController } from './txn-crud.controller';
import { TxnCrudService } from './txn-crud.service';

describe('TxnCrudController', () => {
  let controller: TxnCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TxnCrudController],
      providers: [TxnCrudService],
    }).compile();

    controller = module.get<TxnCrudController>(TxnCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
