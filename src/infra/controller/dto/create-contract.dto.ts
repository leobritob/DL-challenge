import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ContractStatusEnum } from '../../../domain/entity/contract/contract-status.enum';

export class CreateContractDto {
  @IsNotEmpty()
  terms: string;

  @IsNotEmpty()
  @IsEnum(ContractStatusEnum)
  status: ContractStatusEnum;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsUUID()
  contractorId: string;

  constructor(params?: any) {
    this.terms = params?.terms;
    this.status = params?.status;
    this.clientId = params?.clientId;
    this.clientId = params?.clientId;
    this.contractorId = params?.contractorId;
  }
}
