import { Action } from './action.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({
    default: 'user',
  })
  username: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  })
  products: Action[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
