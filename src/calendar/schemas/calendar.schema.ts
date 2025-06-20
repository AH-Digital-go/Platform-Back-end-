import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Calendar extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: Object, default: {} })
  settings: Record<string, any>;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);