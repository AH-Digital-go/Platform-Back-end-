import { PartialType } from '@nestjs/mapped-types';
import { CreateSubaccountDto } from './create-subaccount.dto';

export class UpdateSubaccountDto extends PartialType(CreateSubaccountDto) {}
