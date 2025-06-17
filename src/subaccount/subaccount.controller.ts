import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SubaccountService } from './subaccount.service';
import { CreateSubaccountDto } from './dto/create-subaccount.dto';
import { UpdateSubaccountDto } from './dto/update-subaccount.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentAgency } from 'src/common/decorators/current-agency.decorator';
import { AgencyDocument } from 'src/agencies/schemas/agency.schema';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('subaccounts')
export class SubaccountController {
  constructor(private readonly subaccountService: SubaccountService) {}

  
  
//   @Roles('agency-owner', 'agency-admin')
//   @Post()
//   create(@Body() dto: CreateSubaccountDto, @Req() req) {
//     const agencyId = req.user.agencyId;
//     console.log('🔍 create hit',  req.user);
//     return this.subaccountService.createSubaccount(dto, agencyId);
//   }
// ,
    // @CurrentAgency() agency: AgencyDocument
    @Post()
    async createSubaccount(
    @Body() dto: CreateSubaccountDto
    ) {
    return this.subaccountService.createSubaccount(dto);
    }

  @Get()
  findAll(@CurrentAgency() agencyId: Types.ObjectId) {
    // console.log('🔍 from subaccount find all controller, agency: ', agencyId);
    return this.subaccountService.findAllByAgency(agencyId);
  }
  
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.subaccountService.findOne(_id);
  }

//   @Roles('agency-owner', 'agency-admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubaccountDto) {
    return this.subaccountService.update(id, dto);
  }

  // we wont be executing DELETE endpoints soon since we are not allowing anything to be deleted
  // but we will keep it for future use
  @Roles('agency-owner', 'agency-admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subaccountService.delete(id);
  }
}
