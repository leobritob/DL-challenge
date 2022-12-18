import { ContractRepository } from '../../../domain/repository/contract.repository';
import { JobRepository } from '../../../domain/repository/job.repository';
import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../../domain/repository/repository.factory';
import { ContractRepositoryMemory } from '../../repository/memory/contract.repository';
import { JobRepositoryMemory } from '../../repository/memory/job.repository';
import { ProfileRepositoryMemory } from '../../repository/memory/profile.repository';

export class RepositoryFactoryMemory implements RepositoryFactory {
  createContractRepository(): ContractRepository {
    return new ContractRepositoryMemory();
  }

  createJobRepository(): JobRepository {
    return new JobRepositoryMemory();
  }

  createProfileRepository(): ProfileRepository {
    return new ProfileRepositoryMemory();
  }
}
