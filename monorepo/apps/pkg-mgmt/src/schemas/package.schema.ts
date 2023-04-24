import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Factory } from 'nestjs-seeder';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package {
  @Factory((faker) => faker.helpers.unique(faker.company.name))
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  name: string;

  @Factory((faker) => faker.datatype.number({ min: 30, max: 365 }))
  @Prop({
    type: Number,
    minimum: 30,
    required: true,
  })
  duration: number;

  @Factory((faker) => faker.commerce.price(100000, 500000, 0))
  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Factory((faker) => faker.datatype.number({ min: 1, max: 50 }))
  @Prop({
    type: Number,
    required: true,
    minimum: 1,
  })
  noOfMember: number;

  @Factory((faker) => faker.lorem.paragraph())
  @Prop({
    type: String,
    maxlength: 1000,
    required: false,
  })
  description: string;

  @Factory((faker) => faker.database.mongodbObjectId())
  @Prop({
    type: String,
  })
  createdBy: string;

  @Factory((faker, ctx) => ctx.createdBy)
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
