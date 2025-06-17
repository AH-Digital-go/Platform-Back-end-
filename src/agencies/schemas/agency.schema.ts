import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type AgencyDocument = Agency & Document;

@Schema({ timestamps: true })
export class Agency {
  @Prop({ required: true })
  friendlyName: string;

  @Prop({ required: true })
  legalName: string;

  @Prop({ required: true })
  businessEmail: string;

  @Prop()
  businessPhone?: string;

  @Prop()
  businessWebsite?: string;

  @Prop()
  businessNiche?: string;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
  timeZone: string;

  @Prop({ required: false })
  platformLanguage: string;

  @Prop()
  logoUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const AgencySchema = SchemaFactory.createForClass(Agency);
