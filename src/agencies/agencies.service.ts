import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agency, AgencyDocument } from './schemas/agency.schema';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { User } from 'src/users/schemas/user.schema';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
    private jwtService: JwtService,

  ) {}

async create(createAgencyDto: CreateAgencyDto, ownerId: string): Promise<{ agency: Agency; token: string }> {
  // 1. Create agency instance
  const newAgency = new this.agencyModel({
    ...createAgencyDto,
    owner: ownerId,
  });

  // 2. Save the new agency first to get _id assigned
  const savedAgency = await newAgency.save();

  // 3. Update user with the new agencyId, get updated user back
  const updatedUser = await this.userModel.findByIdAndUpdate(
    ownerId,
    { agencyId: savedAgency._id },
    { new: true }
  );

   // Sign new JWT
  const payload = {
    sub: updatedUser?._id,
    email: updatedUser?.email,
    role: updatedUser?.role,
    agencyId: updatedUser?.agencyId,
    subaccountId: updatedUser?.subaccountId,
  };

  const newToken = this.jwtService.sign(payload);


  // console.log('Updated user:', updatedUser);

  // 4. Return the saved agency
  return {
    agency:savedAgency,
    token: newToken,
  };
}


  async findByOwner(ownerId: string): Promise<Agency[]> {
    return this.agencyModel.find({ owner: ownerId }).exec();
  }

async getAgencyForUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user || !user.agencyId) {
      throw new NotFoundException('User or agency not found');
    }

    const agency = await this.agencyModel.findById(user.agencyId).lean();
    // console.log('AGENCY:', agency); 
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    return agency;
  }


  async findById(id: string | Types.ObjectId): Promise<Agency> {
    const agency = await this.agencyModel.findById(id).exec();
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }
    return agency;
  }
}
