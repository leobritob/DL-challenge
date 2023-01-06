import { IsDateString, IsEnum, IsNotEmpty, IsPositive, IsUUID, MaxLength } from 'class-validator';
import { JobPaidEnum } from '../../../domain/entity/job/job-paid.enum';

export class CreateJobDto {
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsEnum(JobPaidEnum)
  paid: JobPaidEnum;

  @IsNotEmpty()
  @IsDateString()
  paymentDate: Date;

  @IsNotEmpty()
  @IsUUID()
  contractId: string;

  constructor(params: any) {
    this.description = params?.description;
    this.price = params?.price;
    this.paid = params?.paid;
    this.paymentDate = params?.paymentDate;
    this.contractId = params?.contractId;
  }
}
