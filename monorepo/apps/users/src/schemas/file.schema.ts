import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop()
  fileName: string;

  @Prop()
  fileSize: number;

  @Prop()
  contentType: string;

  @Prop({ enum: ['hex', 'base64'] })
  dataType: string;

  @Prop()
  fileData: string;

  @Prop()
  uploadDate: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
