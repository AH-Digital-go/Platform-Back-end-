import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Contact {
  @Prop({ type: String, default: uuidv4, unique: true })
  contactId: string; // Use contactId to avoid conflict with Mongoose's id

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ required: true })
  budgetRange: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);