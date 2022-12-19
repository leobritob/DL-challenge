import { ContractRepository } from '../../../domain/repository/contract.repository';
import { JobRepository } from '../../../domain/repository/job.repository';
import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../../domain/repository/repository.factory';
import { SequelizeContractRepository } from '../../repository/sequelize/contract.repository';
import { SequelizeJobRepository } from '../../repository/sequelize/job.repository';
import { SequelizeProfileRepository } from '../../repository/sequelize/profile.repository';
import { DatabaseConnection } from '../database';

export class SequelizeRepositoryFactory implements RepositoryFactory {
  constructor(private readonly database: DatabaseConnection) {}

  createContractRepository(): ContractRepository {
    return new SequelizeContractRepository(this.database);
  }

  createJobRepository(): JobRepository {
    return new SequelizeJobRepository(this.database);
  }

  createProfileRepository(): ProfileRepository {
    return new SequelizeProfileRepository(this.database);
  }
}
