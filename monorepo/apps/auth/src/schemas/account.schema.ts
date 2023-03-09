import { Role } from './role.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BCRYPT_HASHED_PASSWORD_LENGTH } from '../core/constants';

export type AccountDocument = HydratedDocument<Account>;

enum EAccountStatus {
  'active',
  'TBD',
  'inactive',
}

@Schema({
  timestamps: true,
})
export class Account {
  @Prop({
    unique: true,
    type: String,
  })
  username: string;

  @Prop({
    type: String,
    length: BCRYPT_HASHED_PASSWORD_LENGTH,
  })
  hashPwd: string;

  @Prop({
    type: String,
    length: BCRYPT_HASHED_PASSWORD_LENGTH,
  })
  deletedAt: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ type: String, enum: EAccountStatus, default: EAccountStatus.active })
  status: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
