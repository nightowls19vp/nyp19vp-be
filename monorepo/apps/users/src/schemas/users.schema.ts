import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserSetting } from './setting.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    unique: true,
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: Date
  })
  dob: Date;

  @Prop({
    unique: true,
    type: String,
    required: true
  })
  email: string;

  @Prop({
    unique: true,
    type: String
  })
  phone: string;

  @Prop({
    type: String,
    required: false
  })
  avatar: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'UserSetting'
  })
  setting: UserSetting

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date

  @Prop({
    type: Date
  })

  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
