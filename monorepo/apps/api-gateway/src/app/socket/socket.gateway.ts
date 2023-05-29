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
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';

@WebSocketGateway(3000, { cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(client.id, 'Connected..............................');
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, 'Disconnect');
  }

  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }

  @SubscribeMessage('checkout_callback')
  async checkout_callback(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    return this.socketService.checkout_callback(client, data);
  }

  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage('findAllSocket')
  findAll() {
    return this.socketService.findAll();
  }

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    return this.socketService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return this.socketService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    return this.socketService.remove(id);
  }
}
