import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSettingDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({
    type: String,
    unique: true,
    required: true
  })
  package: string

  @Prop({
    type: Int32Array,
    min: 1,
    required: true
  })
  quantity: number

  @Prop({
    type: Float32Array,
    required: true
  })
  price: number
}

export const ItemSchema = SchemaFactory.createForClass(Item);