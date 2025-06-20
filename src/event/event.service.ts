import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../calendar/schemas/event.schema';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private calendarService: CalendarService,
  ) {}

  async create(createEventDto: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    guests?: string;
    backgroundColor?: string;
    calendarId: string;
  }) {
    // Verify calendar exists
    await this.calendarService.findOne(createEventDto.calendarId);

    const event = new this.eventModel(createEventDto);
    return await event.save();
  }

  async findAllByCalendar(calendarId: string) {
    // Verify calendar exists
    await this.calendarService.findOne(calendarId);

    return await this.eventModel.find({ calendarId }).exec();
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: {
    title?: string;
    start?: Date;
    end?: Date;
    description?: string;
    location?: string;
    guests?: string;
    backgroundColor?: string;
  }) {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async delete(id: string) {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return result;
  }

  async findByDateRange(calendarId: string, start: Date, end: Date) {
    // Verify calendar exists
    await this.calendarService.findOne(calendarId);

    return await this.eventModel
      .find({
        calendarId,
        $or: [
          { start: { $gte: start, $lte: end } },
          { end: { $gte: start, $lte: end } },
          { start: { $lte: start }, end: { $gte: end } },
        ],
      })
      .exec();
  }
}