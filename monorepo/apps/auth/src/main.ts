import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthModule } from './app/auth.module';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'auth-consumer' + randomUUID(),
        },
      },
    },
  );
  app.listen();
}
bootstrap();
