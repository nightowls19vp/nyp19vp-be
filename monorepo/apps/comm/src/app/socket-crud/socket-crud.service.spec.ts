import { Test, TestingModule } from '@nestjs/testing';
import { SocketCrudService } from './socket-crud.service';

describe('SocketCrudService', () => {
  let service: SocketCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketCrudService],
    }).compile();

    service = module.get<SocketCrudService>(SocketCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
