import { Module } from '@nestjs/common';
import { PkgMgmtService } from './pkg-mgmt.service';
import { PkgMgmtController } from './pkg-mgmt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + randomUUID(), // FIXME,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer' + randomUUID(),
          },
        },
      },
    ]),
  ],
  controllers: [PkgMgmtController],
  providers: [PkgMgmtService],
})
export class PkgMgmtModule {}
