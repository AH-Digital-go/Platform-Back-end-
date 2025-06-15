// decorators/current-agency.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { Agency } from 'src/agencies/schemas/agency.schema';

export const CurrentAgency = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AgencyDocument => {
    const request = ctx.switchToHttp().getRequest();
    // console.log('CurrentAgency decorator request object:', request);
    return request.user.agencyId;
  },
);

// This decorator extracts the current agency from the request object.
// It assumes that the agency has been set in the request by a middleware or guard.
export type AgencyDocument = HydratedDocument<Agency>;
