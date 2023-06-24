import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Item } from './item.schema';
import { UserSetting } from './setting.schema';
import MongooseDelete, { SoftDeleteDocument } from 'mongoose-delete';

export type UserDocument = HydratedDocument<User> & SoftDeleteDocument;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date })
  dob: Date;

  @Prop({ unique: true, type: String, required: true })
  email: string;

  @Prop({
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { phone: { $type: 'string' } },
    },
  })
  phone: string;

  @Prop({
    required: false,
    type: String,
    default:
      'https://res.cloudinary.com/dzpxhrxsq/image/upload/v1648138020/cld-sample.jpg',
  })
  avatar: string;

  @Prop({ required: true, default: Object })
  setting: UserSetting;

  @Prop({ required: true, default: [] })
  cart: Item[];

  @Prop({ required: true, default: [] })
  trxHist: string[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(MongooseDelete, { overrideMethods: true, deletedAt: true });

UserSchema.index({ name: 'text', email: 'text', phone: 'text' });
