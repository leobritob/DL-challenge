import { IsNotEmpty, IsPositive } from 'class-validator';

export class DepositToAClientDto {
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  constructor(params: any) {
    this.amount = params.amount;
  }
}
