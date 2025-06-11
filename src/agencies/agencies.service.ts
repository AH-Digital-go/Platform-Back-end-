import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency, AgencyDocument } from './schemas/agency.schema';
import { CreateAgencyDto } from './dto/create-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
  ) {}

  async create(createAgencyDto: CreateAgencyDto, ownerId: string): Promise<Agency> {
    const newAgency = new this.agencyModel({
      ...createAgencyDto,
      owner: ownerId,
    });
    return newAgency.save();
  }

  async findByOwner(ownerId: string): Promise<Agency[]> {
    return this.agencyModel.find({ owner: ownerId }).exec();
  }
}
