import { DepositToAClientUseCase } from '../application/use-case/deposit-to-a-client.use-case';
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

describe('DepositToAClientUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let jobRepository: JobRepository;
  let contractRepository: ContractRepository;
  let profileRepository: ProfileRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    jobRepository = repositoryFactory.createJobRepository();
    contractRepository = repositoryFactory.createContractRepository();
    profileRepository = repositoryFactory.createProfileRepository();
  });

  it('should be able to deposit an amount to client balance', async () => {
    // Arrange
    const useCase = new DepositToAClientUseCase(repositoryFactory);

    const client = createProfileFake({ balance: 100, type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, client, contractorId: contractor.id, contractor });
    await contractRepository.create(contract);

    const job = createJobFake({
      paid: JobPaidEnum.YES,
      paymentDate: new Date(),
      price: 90,
      contractId: contract.id,
      contract,
    });
    await jobRepository.create(job);

    const clientBalance = client.balance;
    const clientId = client.id;
    const amount = job.price * 1.05;

    try {
      // Act
      await useCase.execute(clientId, amount);
      const after = await profileRepository.findOneById(clientId);
      expect(after.balance).toBeGreaterThan(clientBalance);
    } catch (error) {
      // Assert
      expect(error).toBeUndefined();
    }
  });

  it('should not be able to deposit an amount to client balance when amount is greater than allowed', async () => {
    // Arrange
    const useCase = new DepositToAClientUseCase(repositoryFactory);
    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);
    const contract = createContractFake({ clientId: client.id, client, contractorId: contractor.id, contractor });
    await contractRepository.create(contract);
    const job = createJobFake({
      paid: JobPaidEnum.YES,
      paymentDate: new Date(),
      price: 90,
      contractId: contract.id,
      contract,
    });
    await jobRepository.create(job);

    const clientId = client.id;
    const amount = job.price * 2;

    try {
      // Act
      await useCase.execute(clientId, amount);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});
