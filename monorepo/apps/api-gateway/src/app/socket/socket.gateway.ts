import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketService } from './socket.service';
import { CommService } from '../comm/comm.service';
import { ClientSocketReqDto } from '@nyp19vp-be/shared';

@WebSocketGateway(3001, { cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly commService: CommService,
  ) {}

  @WebSocketServer() server: Server;

  getUserFromToken(client: Socket) {
    const token = client.handshake?.query?.token;
    return token;
  }

  async handleConnection(client: Socket) {
    const user = this.getUserFromToken(client);
    console.log(user, client.id, 'Connected..............................');
    await this.commService.createClientSocket(
      mapToClientSocketReqDto(user, client),
    );
  }

  async handleDisconnect(client: Socket) {
    const user = this.getUserFromToken(client);
    console.log(user, client.id, 'Disconnect');
    await this.commService.removeClientSocket(
      mapToClientSocketReqDto(user, client),
    );
  }

  afterInit(server: any) {
    console.log(server, 'init.');
  }

  @SubscribeMessage('checkout_callback')
  async checkout_callback(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    return this.socketService.checkout_callback(client, data);
  }
}
const mapToClientSocketReqDto = (user, client: Socket): ClientSocketReqDto => {
  const clientSocketReqDto: ClientSocketReqDto = {
    user_id: user,
    client_id: client.id,
  };
  return clientSocketReqDto;
};
