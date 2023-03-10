import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserSetting } from './setting.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
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
    default: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/07/hinh-avatar-hai-vit-trang-cat-dau-moi.jpg',
    required: false
  })
  avatar: string;

  @Prop({
    required: true,
    default: Object
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
