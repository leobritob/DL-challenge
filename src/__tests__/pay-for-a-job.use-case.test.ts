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
import { MemoryQueueAdapter } from '../infra/queue/memory.queue';
import { Queue } from '../infra/queue/queue';
import { createContractFake } from './helper/create-contract.fake';
import { createJobFake } from './helper/create-job.fake';
import { createProfileFake } from './helper/create-profile.fake';

describe('PayForAJobUseCase', () => {
  let queue: Queue;
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let jobRepository: JobRepository;
  let profileRepository: ProfileRepository;
  let contractRepository: ContractRepository;

  beforeAll(async () => {
    queue = new MemoryQueueAdapter();
    await queue.connect();
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
    const useCase = new PayForAJobUseCase(repositoryFactory, queue);
    const publish = jest.fn();
    jest.spyOn(queue, 'publish').mockImplementationOnce(publish);

    const client = createProfileFake({ balance: 100, type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ balance: 50, type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const job = createJobFake({ paid: JobPaidEnum.NO, paymentDate: new Date(), price: 50, contractId: contract.id });
    await jobRepository.create(job);

    // Act
    await useCase.execute(job.id);

    // Assert
    expect(queue.publish).toHaveBeenCalledTimes(1);
  });

  it('should not be able to pay a job that it is already paid', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory, queue);

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

  it('should throw an exception when job is not exists', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory, queue);
    const jobId = 'nonexistent-job-id';

    // Act
    try {
      await useCase.execute(jobId);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });

  it("should throw an exception when client's balance is not enough to pay for the job", async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory, queue);

    const client = createProfileFake({ balance: 49, type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ balance: 50, type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const job = createJobFake({ paid: JobPaidEnum.NO, paymentDate: new Date(), price: 50, contractId: contract.id });
    await jobRepository.create(job);

    // Act
    try {
      await useCase.execute(job.id);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});
