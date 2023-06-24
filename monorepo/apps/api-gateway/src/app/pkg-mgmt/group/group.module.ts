import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocketGateway } from '../../socket/socket.gateway';
import { SocketService } from '../../socket/socket.service';
import { CommModule } from '../../comm/comm.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt' + 'api-gateway' + 'group',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + 'api-gateway' + 'group',
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth' + 'api-gateway' + 'group',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'auth-consumer' + 'api-gateway' + 'group',
          },
        },
      },
    ]),
    CommModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, SocketGateway, SocketService],
})
export class GroupModule {}
