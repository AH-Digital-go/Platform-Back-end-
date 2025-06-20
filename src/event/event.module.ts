import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../calendar/schemas/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    CalendarModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}