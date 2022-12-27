import { DepositToAClientProcessorUseCase } from '../application/use-case/deposit-to-a-client-processor.use-case';
import { JobPaidEnum } from '../domain/entity/job/job-paid.enum';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { DepositToAClientEventParams } from '../domain/event/deposit-to-a-client/deposit-to-a-client-event-params.interface';
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

describe('DepositToAClientProcessorUseCase', () => {
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
    const useCase = new DepositToAClientProcessorUseCase(repositoryFactory);

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

    const params: DepositToAClientEventParams = { clientId, amount };

    // Act
    await useCase.execute(params);

    // Assert
    const after = await profileRepository.findOneById(clientId);
    expect(after.balance).toBeGreaterThan(clientBalance);
  });
});
