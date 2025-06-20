import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCalendarDto: { name: string; ownerId: string; settings?: any }) {
    return await this.calendarService.create(createCalendarDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('ownerId') ownerId: string) {
    return await this.calendarService.findAll(ownerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.calendarService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCalendarDto: { name?: string; settings?: any }) {
    return await this.calendarService.update(id, updateCalendarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.calendarService.delete(id);
  }
}