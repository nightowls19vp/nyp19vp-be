import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Item } from './item.schema';
import { UserSetting } from './setting.schema';
import { Factory } from 'nestjs-seeder';
import MongooseDelete, { SoftDeleteDocument } from 'mongoose-delete';
import { File } from './file.schema';

export type UserDocument = HydratedDocument<User> & SoftDeleteDocument;

@Schema({ timestamps: true })
export class User {
  @Factory((faker) => faker.name.fullName())
  @Prop({ type: String, required: true })
  name: string;

  @Factory((faker) => faker.date.birthdate())
  @Prop({ type: Date })
  dob: Date;

  @Factory((faker, ctx) =>
    faker.helpers.unique(faker.internet.email, [ctx.name])
  )
  @Prop({ unique: true, type: String, required: true })
  email: string;

  @Factory((faker) => faker.helpers.unique(faker.phone.number, ['0#########']))
  @Prop({ unique: true, type: String })
  phone: string;

  // @Factory((faker) => faker.image.avatar())
  @Prop({ required: false })
  avatar: File;

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
