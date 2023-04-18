import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/users.schema';
import { UsersSeeder } from './users.seeder';
import { DataBaseModule } from '../database/database.module';

seeder({
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UsersSeeder]);

export class SeederModule {}
