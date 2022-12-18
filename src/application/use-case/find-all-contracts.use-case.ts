import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';
import { ContractRepository } from '../../domain/repository/contract.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class FindAllContractsUseCase {
  contractRepository: ContractRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.contractRepository = this.repositoryFactory.createContractRepository();
  }

  async execute(profileId: string) {
    return await this.contractRepository.findAll({
      clientId: profileId,
      status: [ContractStatusEnum.IN_PROGRESS, ContractStatusEnum.NEW],
    });
  }
}
