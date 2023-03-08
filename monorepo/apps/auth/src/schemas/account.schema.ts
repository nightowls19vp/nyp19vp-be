import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({
    unique: true,
  })
  username: string;

  @Prop({})
  hashPwd: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
