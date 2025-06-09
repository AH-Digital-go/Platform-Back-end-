import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // 👈 import it
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallbackSecret',
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: User }]), 
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
