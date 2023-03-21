import { Test, TestingModule } from '@nestjs/testing';
import { PkgCrudService } from './pkg-crud.service';

describe('PkgCrudService', () => {
  let service: PkgCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PkgCrudService],
    }).compile();

    service = module.get<PkgCrudService>(PkgCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
