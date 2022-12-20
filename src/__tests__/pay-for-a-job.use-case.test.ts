import { PayForAJobUseCase } from '../application/use-case/pay-for-a-job.use-case';
import { JobPaidEnum } from '../domain/entity/job/job-paid.enum';
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

describe('PayForAJobUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let jobRepository: JobRepository;
  let profileRepository: ProfileRepository;
  let contractRepository: ContractRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    jobRepository = repositoryFactory.createJobRepository();
    profileRepository = repositoryFactory.createProfileRepository();
    contractRepository = repositoryFactory.createContractRepository();
  });

  it('should be able to pay a job for an user', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory);

    const client = createProfileFake({ balance: 100, type: ProfileTypeEnum.CLIENT });
    const currentClientBalance = client.balance;
    const contractor = createProfileFake({ balance: 50, type: ProfileTypeEnum.CONTRACTOR });
    const currentContractorBalance = contractor.balance;
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const job = createJobFake({ paid: JobPaidEnum.NO, paymentDate: new Date(), price: 50, contractId: contract.id });
    await jobRepository.create(job);

    // Act
    await useCase.execute(job.id);

    // Assert
    const [updatedClient, updatedContractor] = await Promise.all([
      profileRepository.findOneById(client.id),
      profileRepository.findOneById(contractor.id),
    ]);
    expect(updatedContractor.balance).toBeGreaterThan(currentContractorBalance);
    expect(updatedClient.balance).toBeLessThan(currentClientBalance);
  });

  it('should not be able to pay a job that it is already paid', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory);

    const client = createProfileFake({ balance: 100, type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ balance: 50, type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const job = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 50, contractId: contract.id });
    await jobRepository.create(job);

    try {
      // Act
      await useCase.execute(job.id);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});
