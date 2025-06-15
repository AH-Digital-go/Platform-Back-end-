import { Controller, Post, Body, UseGuards, Request, Get, ForbiddenException } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // assuming you already have JWT auth guard
import { CurrentAgency } from 'src/common/decorators/current-agency.decorator';
import { Agency } from './schemas/agency.schema';


@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agencyService: AgenciesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAgency(@Body() createAgencyDto: CreateAgencyDto, @Request() req) {
      // console.log('REQ USER:', req.user); 
    const ownerId = req.user.userId; 
    if (req.user.role !== 'agency-owner') {
      throw new ForbiddenException('Only agency owners can create an agency');
    }
      const agency = await this.agencyService.create(createAgencyDto, ownerId);
      return agency;
  }


  @UseGuards(JwtAuthGuard)
   @Get('my-agency')
   async getMyAgency(@Request() req) {
    // console.log('🔍 getMyAgency hit');
  // console.log('User from JWT:', req.user);
     const user = req.user; // this comes from your JWT payload
     return this.agencyService.getAgencyForUser(user.userId);
   }


   @Get('dashboard')
   getDashboard(@CurrentAgency() agency: Agency) {
     return {
       message: `Welcome to the dashboard for agency ${agency.friendlyName}`,
     };
   }
   
}
