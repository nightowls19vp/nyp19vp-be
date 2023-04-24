import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Item } from './item.schema';
import { Method } from './payment_method.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: String, required: true, unique: true })
  _id: string;

  @Prop({ type: String, required: true })
  user: string;

  @Prop({ required: true, minlength: 1 })
  item: Item[];

  @Prop({ required: true, min: 50 })
  amount: number;

  @Prop({ type: Object, required: true })
  method: Method;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
