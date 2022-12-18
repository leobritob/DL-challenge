import { Contract } from '../entity/contract/contract';
import { ContractStatusEnum } from '../entity/contract/contract-status.enum';

export interface ContractRepository {
  findAll(
    params?: Partial<{ status: ContractStatusEnum[]; clientId: string }>
  ): Promise<Contract[]>;
  create(contract: Contract): Promise<Contract>;
  findOneById(id: string): Promise<Contract>;
}
