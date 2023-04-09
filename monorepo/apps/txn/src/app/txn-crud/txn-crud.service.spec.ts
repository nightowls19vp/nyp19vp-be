import { Test, TestingModule } from '@nestjs/testing';
import { TxnCrudService } from './txn-crud.service';

describe('TxnCrudService', () => {
  let service: TxnCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TxnCrudService],
    }).compile();

    service = module.get<TxnCrudService>(TxnCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
