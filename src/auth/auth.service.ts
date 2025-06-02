import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "src/users/dto/create-user.dto";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  

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

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

async register(dto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  
  const createdUser = await this.usersService.create({
    email: dto.email,
    username: dto.username,
    password: hashedPassword,
    role: dto.role ?? 'account-user',
    active: true,
    subaccountId: '',
  });

  console.log('Password before hashing:', dto.password);
  console.log('Password after hashing:', hashedPassword);

  return this.login(createdUser);
}
 




}
