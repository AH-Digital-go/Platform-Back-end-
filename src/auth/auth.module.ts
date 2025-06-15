import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // 👈 import it
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgenciesModule } from 'src/agencies/agencies.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule, AgenciesModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UsersModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: User }]), 
    MailModule,
    AgenciesModule 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
