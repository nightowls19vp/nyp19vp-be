import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Package } from './package.schema';

export type GrPkgDocument = HydratedDocument<GrPkg>;

@Schema()
export class GrPkg {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  })
  package: Package;

  @Prop({
    type: Date,
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  endDate: Date;

  @Prop({
    type: Date,
  })
  remainingTime: Date;

  @Prop({
    type: String,
    enum: ['Active', 'Expired', 'Not Activated'],
  })
  status: string;
}

export const GrPkgSchema = SchemaFactory.createForClass(GrPkg);
