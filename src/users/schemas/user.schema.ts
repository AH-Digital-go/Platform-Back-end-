import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: String, ref: 'Agency' })
  agencyId: string;

  @Prop({ type: String, ref: 'Subaccount', default: null })
  subaccountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
