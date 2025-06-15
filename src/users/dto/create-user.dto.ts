// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  subaccountId?: string;
}
