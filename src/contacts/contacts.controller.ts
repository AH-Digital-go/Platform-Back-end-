import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':contactId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('contactId') contactId: string) {
    return this.contactsService.findOne(contactId);
  }

  @Patch(':contactId')
  @UseGuards(JwtAuthGuard)
  update(
    
    @Param('contactId') contactId: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(contactId, updateContactDto);
  }

  @Delete(':contactId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('contactId') contactId: string) {
    return this.contactsService.remove(contactId);
  }
}