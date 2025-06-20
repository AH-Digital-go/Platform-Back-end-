import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    guests?: string;
    backgroundColor?: string;
    calendarId: string;
  }) {
    return await this.eventService.create(createEventDto);
  }

  @Get('calendar/:calendarId')
  @UseGuards(JwtAuthGuard)
  async findAllByCalendar(@Param('calendarId') calendarId: string) {
    return await this.eventService.findAllByCalendar(calendarId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.eventService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateEventDto: {
    title?: string;
    start?: Date;
    end?: Date;
    description?: string;
    location?: string;
    guests?: string;
    backgroundColor?: string;
  }) {
    return await this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.eventService.delete(id);
  }

  @Get('calendar/:calendarId/range')
  @UseGuards(JwtAuthGuard)
  async findByDateRange(
    @Param('calendarId') calendarId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.eventService.findByDateRange(calendarId, new Date(start), new Date(end));
  }
}