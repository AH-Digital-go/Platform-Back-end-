import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Agency, AgencySchema } from './schemas/agency.schema';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agency.name, schema: AgencySchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    JwtModule
  ],
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [AgenciesService,MongooseModule],
})
export class AgenciesModule {}
