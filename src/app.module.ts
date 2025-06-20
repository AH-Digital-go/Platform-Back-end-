import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AgenciesModule } from './agencies/agencies.module';
import { SubaccountModule } from './subaccount/subaccount.module';
import { AgencyContextMiddleware } from './common/middleware/agency-context.middleware';
import { ContactsModule } from './contacts/contacts.module';
import { CalendarModule } from './calendar/calendar.module';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/AHD-DEV'),
    UsersModule,
    AuthModule,

    AgenciesModule,

    SubaccountModule,

    ContactsModule,

    CalendarModule,

    EventModule,

  ],
  controllers: [AppController],
  providers: [AppService],

  
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AgencyContextMiddleware)
      .forRoutes('*'); // Apply globally or specify routes
  }
}