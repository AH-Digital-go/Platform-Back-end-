// subaccount.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SubaccountDocument = Subaccount & Document;

@Schema({ timestamps: true })
export class Subaccount {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  website?: string;

  @Prop({ required: true })
  streetAddress: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  timeZone: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' })
  agencyId: string;
}

export const SubaccountSchema = SchemaFactory.createForClass(Subaccount);
export const SubaccountModel = SubaccountSchema;
SubaccountSchema.index({ agencyId: 1, email: 1 }, { unique: true });