import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import MongooseDelete, { SoftDeleteDocument } from 'mongoose-delete';

export type TodosDocument = HydratedDocument<Todos> & SoftDeleteDocument;

class Todo {
  @Prop({ type: String, required: true })
  todo: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Boolean, required: true, default: false })
  isCompleted: boolean;
}

@Schema({ timestamps: true })
export class Todos {
  @Prop({ type: String, required: true })
  summary: string;

  @Prop()
  todos: Todo[];

  @Prop({ type: String, required: false })
  createdBy: string;

  @Prop({ type: String, required: false })
  updatedBy: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TodosSchema = SchemaFactory.createForClass(Todos);
TodosSchema.plugin(MongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});
