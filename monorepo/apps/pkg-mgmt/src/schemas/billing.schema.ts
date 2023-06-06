import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillingDocument = HydratedDocument<Billing>;

@Schema({ timestamps: true })
export class Billing {
  @Prop({ type: String, required: true })
  borrower: string;

  @Prop({ type: String, required: true })
  lender: string;

  @Prop({ type: Number, required: true, min: 10000 })
  amount: number;

  @Prop({
    type: String,
    required: true,
    enum: ['APPROVED', 'PENDING', 'CANCELED'],
  })
  status: string;

  @Prop({ type: String, required: true })
  createdBy: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
