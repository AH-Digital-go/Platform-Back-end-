import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UsersService {


    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}



  async create(userData: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userData);
    // console.log('User data before save:', userData);
    return createdUser.save();
  }


async findByEmail(email: string): Promise<UserDocument | null> {
  const user = await this.userModel
    .findOne({ email })
    .select('+password +agencyId') // explicitly include password + agencyId
    .exec();
  // console.log('User found by email:', user);
  return user;
}

  // async findByEmail(email: string): Promise<User | null> {

  //   const user = await this.userModel.findOne({ email }).lean();
  //   console.log('User found by email:', user);
  //   return user;
  // }

async inviteUser(email: string, role: UserRole, password:string, subaccountId?: string): Promise<void> {
  const existing = await this.userModel.findOne({ email }).lean();
  if (existing) {
    throw new BadRequestException('User already exists');
  }

  if (role.startsWith('account') && !subaccountId) {
    throw new BadRequestException('Subaccount ID is required for subaccount users');
  }

  const token = uuidv4();

  const user = new this.userModel({
    email,
    role,
    password,
    status: role.startsWith('account') ? 'invited' : 'active',
    mustChangePassword: role.startsWith('account') ? true : false,
    inviteToken: token,
    subaccountId: role.startsWith('account') ? subaccountId : null,
  });

  await user.save();

  await this.mailService.sendInviteEmail(email, token);
}


async findByInviteToken(token: string) {
  return this.userModel.findOne({ inviteToken: token });
}

async findAll(): Promise<User[]> {
  const users = await this.userModel.find().lean();
  // console.log('Users from DB:', users.length);
  return users;
}

}

