import { Test, TestingModule } from '@nestjs/testing';
import { PkgMgmtService } from './pkg-mgmt.service';

describe('PkgMgmtService', () => {
  let service: PkgMgmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PkgMgmtService],
    }).compile();

    service = module.get<PkgMgmtService>(PkgMgmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
