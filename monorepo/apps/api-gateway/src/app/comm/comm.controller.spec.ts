import { Test, TestingModule } from '@nestjs/testing';
import { CommController } from './comm.controller';
import { CommService } from './comm.service';

describe('CommController', () => {
  let controller: CommController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommController],
      providers: [CommService],
    }).compile();

    controller = module.get<CommController>(CommController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
