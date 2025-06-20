import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calendar } from './schemas/calendar.schema';

@Injectable()
export class CalendarService {
  constructor(@InjectModel(Calendar.name) private calendarModel: Model<Calendar>) {}

  async create(createCalendarDto: { name: string; ownerId: string; settings?: any }) {
    const calendar = new this.calendarModel(createCalendarDto);
    return await calendar.save();
  }

  async findAll(ownerId: string) {
    return await this.calendarModel.find({ ownerId }).exec();
  }

  async findOne(id: string) {
    const calendar = await this.calendarModel.findById(id).exec();
    if (!calendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return calendar;
  }

  async update(id: string, updateCalendarDto: { name?: string; settings?: any }) {
    const calendar = await this.calendarModel
      .findByIdAndUpdate(id, updateCalendarDto, { new: true })
      .exec();
    if (!calendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return calendar;
  }

  async delete(id: string) {
    const result = await this.calendarModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return result;
  }
}