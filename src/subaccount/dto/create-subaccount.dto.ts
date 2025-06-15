import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsMongoId, IsPhoneNumber, IsEmail, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSubaccountDto {
 @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  businessName: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  streetAddress: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  timeZone: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  
  agencyId: Types.ObjectId | string;
}
