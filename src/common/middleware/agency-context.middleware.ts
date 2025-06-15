// middleware/agency-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AgenciesService } from '../../agencies/agencies.service';

@Injectable()
export class AgencyContextMiddleware implements NestMiddleware {
  constructor(private readonly agencyService: AgenciesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    var agencyId = req.headers['x-agency-id'];

    // 🛠 Normalize agencyId to always be a string (if present)
    if (Array.isArray(agencyId)) {
      agencyId = agencyId[0];
    }

    // console.log('🔍 AgencyContextMiddleware hit:', agencyId);

    if (agencyId) {
// console.log('🔍 Fetching agency with ID:', agencyId);
      const agency = await this.agencyService.findById(agencyId);
    //   console.log('🔍 Agency found:', agency);
      if (agency) {
        req['agency'] = agency;
      }
    }
    next();
  }
}
