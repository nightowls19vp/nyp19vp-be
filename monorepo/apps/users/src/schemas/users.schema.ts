import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Item } from './item.schema';
import { UserSetting } from './setting.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Date,
  })
  dob: Date;

  @Prop({
    unique: true,
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    unique: true,
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
    default:
      'https://res.cloudinary.com/dzpxhrxsq/image/upload/v1648138020/cld-sample.jpg',
    required: false,
  })
  avatar: string;

  @Prop({
    required: true,
    default: Object,
  })
  setting: UserSetting;

  @Prop({
    required: true,
    default: [],
  })
  cart: Item[];

  @Prop({
    required: true,
    default: [],
  })
  trxHist: string[];

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
