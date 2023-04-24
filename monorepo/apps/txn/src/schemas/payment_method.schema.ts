import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MethodDocument = HydratedDocument<Method>;

@Schema()
export class Method {
  @Prop({
    type: String,
    enum: ['Digital Wallet', 'Bank Transfer', 'Play Store'],
  })
  type: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  trans_id: string;

  @Prop({ type: Object, required: false })
  embed_data: string;
}

export const MethodSchema = SchemaFactory.createForClass(Method);
