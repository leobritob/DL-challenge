import { ContractRepository } from '../../domain/repository/contract.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class FindOneContractByIdUseCase {
  contractRepository: ContractRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.contractRepository = this.repositoryFactory.createContractRepository();
  }

  async execute(id: string, profileId: string) {
    const contract = await this.contractRepository.findOneById(id);
    if (!contract) return undefined;
    if (contract.client.id !== profileId) return undefined;
    return contract;
  }
}
