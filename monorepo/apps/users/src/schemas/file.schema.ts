import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ type: String, unique: true, required: true })
  fileName: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ required: true })
  data: string;

  @Prop({ type: String, required: true })
  contentType: string;

  @Prop({ type: Date, required: true })
  uploadDate: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
