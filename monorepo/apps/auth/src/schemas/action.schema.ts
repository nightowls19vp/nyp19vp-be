import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';

export type ActionDocument = HydratedDocument<Action>;

@Schema()
export class Action {
  @Prop({
    unique: true,
    type: String,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  role: Role;

  @Prop({
    Type: String,
    required: true,
  })
  description: string;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
