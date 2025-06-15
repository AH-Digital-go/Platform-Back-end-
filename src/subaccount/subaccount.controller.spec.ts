import { Test, TestingModule } from '@nestjs/testing';
import { SubaccountController } from './subaccount.controller';

describe('SubaccountController', () => {
  let controller: SubaccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubaccountController],
    }).compile();

    controller = module.get<SubaccountController>(SubaccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
