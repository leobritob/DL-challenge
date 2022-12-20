import { Contract } from '../../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../../domain/entity/contract/contract-status.enum';
import { ContractRepository } from '../../../domain/repository/contract.repository';
import { DatabaseConnection } from '../../database/database';

export class ContractRepositoryMemory implements ContractRepository {
  contracts: Contract[] = [];

  constructor(private readonly database: DatabaseConnection) {
    this.contracts = this.database.getModels().contracts;
  }

  findAll(params?: Partial<{ status: ContractStatusEnum[]; profileId: string }>): Promise<Contract[]> {
    let result = [...this.contracts];
    if (params?.profileId) {
      result = result.filter((c) => c.clientId === params.profileId || c.contractorId === params.profileId);
    }
    if (params?.status?.length) {
      result = result.filter((c) => params!.status!.includes(c.status));
    }
    return Promise.resolve(result);
  }

  create(contract: Contract): Promise<Contract> {
    this.contracts.push(contract);
    return Promise.resolve(contract);
  }

  findOneById(id: string, profileId: string): Promise<Contract> {
    const contract = this.contracts.find(
      (c) => c.id === id && (c.clientId === profileId || c.contractorId === profileId)
    );
    if (!contract) {
      throw new Error('Contract not found');
    }
    return Promise.resolve(contract);
  }
}
