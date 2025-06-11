import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  friendlyName: string;

  @IsString()
  legalName: string;

  @IsEmail()
  businessEmail: string;

  @IsOptional()
  @IsString()
  businessPhone?: string;

  @IsOptional()
  @IsString()
  businessWebsite?: string;

  @IsOptional()
  @IsString()
  businessNiche?: string;

  @IsString()
  country: string;

  @IsString()
  timeZone: string;

  @IsString()
  platformLanguage: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
