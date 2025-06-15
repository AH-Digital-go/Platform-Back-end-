import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserRole } from 'src/users/schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Agency } from 'src/agencies/schemas/agency.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Agency.name) private readonly agencyModel: Model<Agency>
  ) {}

  // ✅ Transactional Agency + Owner Creation
  async registerAgencyOwner(userData: CreateUserDto, agencyData: Partial<Agency>) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Create user with 'agency-owner' role
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.userModel.create(
        [{ ...userData, 
          password: hashedPassword,
          role: UserRole.AGENCY_OWNER }],
        { session },
      );

      // 2. Create agency linked to user
      const agency = await this.agencyModel.create(
        [{ ...agencyData, 
          owner: user[0]._id }],
        { session },
      );

      // 3. Update user with agency ID
      await this.userModel.updateOne(
        { _id: user[0]._id },
        { $set: { agencyId: agency[0]._id } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      // Log in the newly created user to get the JWT token
    const tokenResult = await this.login(user[0]);

    return {
      user: user[0],
      agency: agency[0],
      access_token: tokenResult.access_token,
      requiresPasswordReset: tokenResult.requiresPasswordReset,
    };
    } catch (err) {
      console.error('❌ Failed to create agency and owner:', err);
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerErrorException('Failed to create agency and owner');
    }
  }

  // ✅ User validation for login
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ✅ Login with JWT
  async login(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId || null,
      subaccountId: user.subaccountId?.toString() || null,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
      requiresPasswordReset: user.mustChangePassword,
    };
  }

  // ✅ Register user (non-transactional, used for invited or sub users)
  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createdUser = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
      role: dto.role ?? 'agency-owner',
      active: true,
      subaccountId: '',
    });

    return this.login(createdUser);
  }

  // ✅ Accept invite flow
  async acceptInvite(user: User, password: string, name: string) {
    user.username = name;
    user.password = await bcrypt.hash(password, 10);
    user.status = 'active';
    user.inviteToken = '';
    user.mustChangePassword = false;
    await user.save();
  }

  // ✅ Change password
  async changePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { password: hashed, mustChangePassword: false },
    );
  }
}
