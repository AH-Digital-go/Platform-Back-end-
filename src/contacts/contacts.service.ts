import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactDocument> {
    const contact = new this.contactModel(createContactDto);
    return contact.save();
  }

  async findAll(): Promise<ContactDocument[]> {
    return this.contactModel.find().exec();
  }

  async findOne(contactId: string): Promise<ContactDocument> {
    const contact = await this.contactModel.findOne({ contactId }).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }
    return contact;
  }

  async update(
    contactId: string,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactDocument> {
    const contact = await this.contactModel
      .findOneAndUpdate({ contactId }, { $set: updateContactDto }, { new: true })
      .exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }
    return contact;
  }

  async remove(contactId: string): Promise<void> {
    const result = await this.contactModel.deleteOne({ contactId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }
  }
}