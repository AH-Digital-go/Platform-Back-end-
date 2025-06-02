import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  

// users.service.ts
async create(userData: CreateUserDto): Promise<User> {
  const createdUser = new this.userModel(userData);
  console.log('User data before save:', userData);
  return createdUser.save();
}


  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}

