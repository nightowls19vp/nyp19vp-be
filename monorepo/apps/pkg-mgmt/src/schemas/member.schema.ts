import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema({ timestamps: true })
export class Member {
  @Prop({
    type: String,
    required: true,
  })
  user: string;

  @Prop({
    type: String,
    required: true,
    enum: ['User', 'Super User'],
    default: 'User',
  })
  role: string;

  @Prop({
    type: Date,
  })
  addedBy: Date;

  @Prop({
    type: Date,
  })
  addedAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);