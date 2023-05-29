import { Injectable } from '@nestjs/common';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Socket } from 'socket.io';
import { emit } from 'process';
import { Server } from '@nestjs/microservices';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  @WebSocketServer() server;
  create(createSocketDto: CreateSocketDto) {
    return 'This action adds a new socket';
  }

  findAll() {
    return `This action returns all socket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socket`;
  }

  update(id: number, updateSocketDto: UpdateSocketDto) {
    return `This action updates a #${id} socket`;
  }

  remove(id: number) {
    return `This action removes a #${id} socket`;
  }

  checkout_callback(client, data): any {
    this.server.emit('checkout_callback', data);
  }
}
