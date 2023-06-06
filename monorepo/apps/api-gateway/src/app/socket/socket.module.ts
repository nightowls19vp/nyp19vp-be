import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { CommModule } from '../comm/comm.module';

@Module({
  imports: [CommModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
