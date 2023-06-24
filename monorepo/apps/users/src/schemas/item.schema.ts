import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ type: String, unique: true, required: true })
  package: string;

  @Prop({ type: Number, min: 1, required: false })
  duration: number;

  @Prop({ type: Number, min: 2, required: false })
  noOfMember: number;

  @Prop({ type: Number, min: 1, required: true })
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
