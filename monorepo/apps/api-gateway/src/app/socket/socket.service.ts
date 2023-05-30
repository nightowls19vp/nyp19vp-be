import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { CommService } from '../comm/comm.service';

@Injectable()
export class SocketService {
  constructor(private readonly commService: CommService) {}
  @WebSocketServer() server: Server;

  async checkout_callback(client, data): Promise<any> {
    const clients = await this.commService.getClientSocket(data);
    console.log('haha', clients.socket.client_id);
    client.emit('send-message', data);
  }

  async zalopay_callback(user_id: string, req: string) {
    const client = await this.commService.getClientSocket(user_id);
    console.log(client.socket.client_id);
    this.server.to(client.data?.['client_id']).emit('zpCallback', req);
  }
}
