import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ type: String, unique: true, required: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, min: 50 })
  price: number;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
