import { ContractRepository } from './contract.repository';
import { JobRepository } from './job.repository';
import { ProfileRepository } from './profile.repository';

export interface RepositoryFactory {
  createContractRepository(): ContractRepository;
  createJobRepository(): JobRepository;
  createProfileRepository(): ProfileRepository;
}
