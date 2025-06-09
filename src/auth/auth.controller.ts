import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator'; // Custom decorator
import { User, UserRole } from 'src/users/schemas/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException();

    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    console.log('DTO received in controller:', dto);
    return this.authService.register(dto);
  }

@Post('invite')
// @UseGuards(JwtAuthGuard, RolesGuard) // optional: restrict to agency-admins
async inviteUser(
  @Body() dto: { email: string; role: UserRole },
): Promise<{ message: string }> {
  await this.usersService.inviteUser(dto.email, dto.role);
  return { message: 'User invited successfully. Check their email.' };
}

@Put('change-password')
@UseGuards(JwtAuthGuard)
async changePassword(
  @CurrentUser() user: any,
  @Body() dto: ChangePasswordDto,
) {
  await this.authService.changePassword(user._id.toString(), dto.newPassword);
  return { message: 'Password updated successfully' };
}


@Put('accept-invite/:token')
async acceptInvite(
  @Param('token') token: string,
  @Body() dto: { name: string; password: string },
) {
  const user = await this.usersService.findByInviteToken(token);
  if (!user || user.status !== 'invited') {
    throw new UnauthorizedException('Invalid or expired invite');
  }

  await this.authService.acceptInvite(user, dto.password, dto.name);

  return { message: 'User activated' };
}


@Get('check-invite/:token')
async checkInvite(@Param('token') token: string) {
  const user = await this.usersService.findByInviteToken(token);
  if (!user || user.status !== 'invited') {
    throw new UnauthorizedException('Invalid or expired invite');
  }
  return { valid: true, email: user.email }; // you can return more if needed
}


}
