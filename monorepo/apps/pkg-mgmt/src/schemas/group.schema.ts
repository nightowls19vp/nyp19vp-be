import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GrPkg } from './gr-pkg.schema';
import { Member } from './member.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    minlength: 1,
  })
  packages: GrPkg[];

  @Prop({
    required: true,
    minlength: 1,
  })
  members: Member[];

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

export const GroupSchema = SchemaFactory.createForClass(Group);
