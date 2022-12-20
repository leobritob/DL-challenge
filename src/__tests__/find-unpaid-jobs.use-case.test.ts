import { FindUnpaidJobsUseCase } from '../application/use-case/find-unpaid-jobs.use-case';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { ContractRepository } from '../domain/repository/contract.repository';
import { JobRepository } from '../domain/repository/job.repository';
import { ProfileRepository } from '../domain/repository/profile.repository';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { DatabaseConnection } from '../infra/database/database';
import { MemoryDatabase } from '../infra/database/memory/database';
import { MemoryRepositoryFactory } from '../infra/database/memory/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { createJobFake } from './helper/create-job.fake';
import { createProfileFake } from './helper/create-profile.fake';

describe('FindUnpaidJobsUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let contractRepository: ContractRepository;
  let profileRepository: ProfileRepository;
  let jobRepository: JobRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    contractRepository = repositoryFactory.createContractRepository();
    profileRepository = repositoryFactory.createProfileRepository();
    jobRepository = repositoryFactory.createJobRepository();
  });

  it('should be able to return an unpaid jobs list', async () => {
    // Arrange
    const useCase = new FindUnpaidJobsUseCase(repositoryFactory);

    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(contractor), profileRepository.create(client)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const job = createJobFake({ contractId: contract.id });
    await jobRepository.create(job);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be able to return an empty unpaid jobs list', async () => {
    // Arrange
    const useCase = new FindUnpaidJobsUseCase(repositoryFactory);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });
});
