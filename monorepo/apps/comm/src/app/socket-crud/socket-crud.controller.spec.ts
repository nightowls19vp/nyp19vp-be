import { Test, TestingModule } from '@nestjs/testing';
import { SocketCrudController } from './socket-crud.controller';
import { SocketCrudService } from './socket-crud.service';

describe('SocketCrudController', () => {
  let controller: SocketCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocketCrudController],
      providers: [SocketCrudService],
    }).compile();

    controller = module.get<SocketCrudController>(SocketCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
