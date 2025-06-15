// subaccount.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subaccount, SubaccountSchema } from './schemas/subaccount.schema';
import { SubaccountService } from './subaccount.service';
import { SubaccountController } from './subaccount.controller';
import { AgencyContextMiddleware } from 'src/common/middleware/agency-context.middleware';
import { AgenciesService } from 'src/agencies/agencies.service';
import { AgenciesModule } from 'src/agencies/agencies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subaccount.name, schema: SubaccountSchema }]),
    AgenciesModule
  ],
  controllers: [SubaccountController],
  providers: [SubaccountService],
  exports: [SubaccountService],
})
export class SubaccountModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AgencyContextMiddleware)
  //     .forRoutes(SubaccountController); // { path: 'subaccounts', method: RequestMethod.POST }
  // }
}
