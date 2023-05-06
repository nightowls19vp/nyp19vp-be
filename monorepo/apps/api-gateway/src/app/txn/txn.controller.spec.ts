import { Test, TestingModule } from '@nestjs/testing';
import { TxnController } from './txn.controller';
import { TxnService } from './txn.service';

describe('TxnController', () => {
  let controller: TxnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TxnController],
      providers: [TxnService],
    }).compile();

    controller = module.get<TxnController>(TxnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
