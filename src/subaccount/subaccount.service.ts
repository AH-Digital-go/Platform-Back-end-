import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subaccount, SubaccountDocument } from './schemas/subaccount.schema';
import { CreateSubaccountDto } from './dto/create-subaccount.dto';
import { UpdateSubaccountDto } from './dto/update-subaccount.dto';
import { Types } from 'mongoose';
@Injectable()
export class SubaccountService {
  constructor(
    @InjectModel(Subaccount.name)
    private subaccountModel: Model<SubaccountDocument>,
  ) {}


// , agencyId: Types.ObjectId | string
    async createSubaccount(dto: CreateSubaccountDto): Promise<Subaccount> {
    const subaccount = await this.subaccountModel.create({
        ...dto,
        // agencyId,
    });
    // console.log('from create subaccount service: ', subaccount);
    return subaccount;
  }

  async findAllByAgency(agencyId: Types.ObjectId | string): Promise<Subaccount[]> {
    return this.subaccountModel.find({ agencyId }).exec();
  }

  async findOne(_id: string): Promise<Subaccount> {
    const subaccount = await this.subaccountModel.findById(_id);
    if (!subaccount) throw new NotFoundException('Subaccount not found');
    return subaccount;
  }

  async update(id: string, dto: UpdateSubaccountDto): Promise<Subaccount> {
    const updated = await this.subaccountModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Subaccount not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.subaccountModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Subaccount not found');
  }
}
