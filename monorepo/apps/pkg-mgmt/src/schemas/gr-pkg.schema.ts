import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Package } from './package.schema';

export type GrPkgDocument = HydratedDocument<GrPkg>;

class Pkg {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, minimum: 1 })
  duration: number;

  @Prop({ type: Number, required: true, minimum: 2 })
  noOfMember: number;
}

@Schema()
export class GrPkg {
  @Prop({ required: true })
  package: Pkg;

  @Prop({ type: Date, required: false })
  startDate: Date;

  @Prop({ type: Date, required: false })
  endDate: Date;

  @Prop({ type: String, required: false })
  remainingTime: string;

  @Prop({
    type: String,
    enum: ['Active', 'Expired', 'Not Activated'],
    required: true,
  })
  status: string;
}

export const GrPkgSchema = SchemaFactory.createForClass(GrPkg);
