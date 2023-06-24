import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSettingDocument = HydratedDocument<UserSetting>;

@Schema()
export class UserSetting {
  @Prop({ type: Boolean, default: true })
  stockNoti: boolean;

  @Prop({ type: Boolean, default: true })
  callNoti: boolean;

  @Prop({ type: Boolean, default: true })
  msgNoti: boolean;

  @Prop({ type: Boolean, default: true })
  newsNoti: boolean;
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);
