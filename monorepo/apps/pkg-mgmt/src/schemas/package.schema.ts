import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    type: Number,
    minimum: 30,
    required: true,
  })
  duration: number;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    minimum: 1,
  })
  noOfMember: number;

  @Prop({
    type: String,
    maxlength: 1000,
    required: false,
  })
  description: string;

  @Prop({
    type: String,
  })
  createdBy: string;

  @Prop({
    type: String,
  })
  updatedBy: string;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
