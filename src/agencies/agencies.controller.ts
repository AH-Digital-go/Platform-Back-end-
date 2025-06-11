import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // assuming you already have JWT auth guard

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agencyService: AgenciesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAgency(@Body() createAgencyDto: CreateAgencyDto, @Request() req) {
      console.log('REQ USER:', req.user); 
    const ownerId = req.user.userId; 
    const agency = await this.agencyService.create(createAgencyDto, ownerId);
    return agency;
  }
}
