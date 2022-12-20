import { ContractRepository } from '../../domain/repository/contract.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class FindOneContractByIdUseCase {
  contractRepository: ContractRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.contractRepository = this.repositoryFactory.createContractRepository();
  }

  async execute(id: string, profileId: string) {
    return this.contractRepository.findOneById(id, profileId);
  }
}
