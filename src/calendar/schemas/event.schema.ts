import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  guests: string;

  @Prop()
  backgroundColor: string;

  @Prop({ type: Types.ObjectId, ref: 'Calendar', required: true })
  calendarId: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);