import { Test, TestingModule } from '@nestjs/testing';
import { GrCrudService } from './gr-crud.service';

describe('GrCrudService', () => {
  let service: GrCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrCrudService],
    }).compile();

    service = module.get<GrCrudService>(GrCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
