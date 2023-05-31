import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { CommService } from '../comm/comm.service';

@Injectable()
export class SocketService {}
