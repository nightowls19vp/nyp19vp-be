import { Test, TestingModule } from '@nestjs/testing';
import { PkgMgmtController } from './pkg-mgmt.controller';
import { PkgMgmtService } from './pkg-mgmt.service';

describe('PkgMgmtController', () => {
  let controller: PkgMgmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PkgMgmtController],
      providers: [PkgMgmtService],
    }).compile();

    controller = module.get<PkgMgmtController>(PkgMgmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
