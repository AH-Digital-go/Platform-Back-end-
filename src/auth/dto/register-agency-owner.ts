import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAgencyDto } from 'src/agencies/dto/create-agency.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterAgencyOwnerDto {
  @IsNotEmpty()
  user: CreateUserDto;

  @IsNotEmpty()
  agency: CreateAgencyDto;
}
