import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  AGENCY_OWNER = 'agency-owner',
  AGENCY_ADMIN = 'agency-admin',
  AGENCY_USER = 'agency-user',
  SUBACCOUNT_ADMIN = 'account-admin',
  SUBACCOUNT_USER = 'account-user',
}

@Schema({ timestamps: true })
export class User extends Document {
  
  @Prop({ required: false })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ enum: UserRole, required: true ,default: UserRole.AGENCY_OWNER})
  role: UserRole;

  @Prop({ type: String, ref: 'Agency' })
  agencyId: string;

  @Prop({ type: String, ref: 'Subaccount', default: null })
  subaccountId: string;

  @Prop({ default: 'invited' })
  status: 'invited' | 'active';

  @Prop({ default: true })
  mustChangePassword: boolean;

  @Prop()
  inviteToken: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
