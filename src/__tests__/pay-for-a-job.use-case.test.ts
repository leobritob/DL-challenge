import { PayForAJobUseCase } from '../application/use-case/pay-for-a-job.use-case';
import { JobPaidEnum } from '../domain/entity/job/job-paid.enum';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { ContractRepository } from '../domain/repository/contract.repository';
import { JobRepository } from '../domain/repository/job.repository';
import { ProfileRepository } from '../domain/repository/profile.repository';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { DatabaseConnection } from '../infra/database/database';
import { SequelizeDatabase } from '../infra/database/sequelize/database';
import { SequelizeRepositoryFactory } from '../infra/database/sequelize/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { createJobFake } from './helper/create-job.fake';
import { createProfileFake } from './helper/create-profile.fake';

describe('PayForAJobUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let jobRepository: JobRepository;
  let profileRepository: ProfileRepository;
  let contractRepository: ContractRepository;

  beforeEach(async () => {
    database = new SequelizeDatabase();
    await database.connect();
    await database.sync();
    repositoryFactory = new SequelizeRepositoryFactory(database);
    jobRepository = repositoryFactory.createJobRepository();
    profileRepository = repositoryFactory.createProfileRepository();
    contractRepository = repositoryFactory.createContractRepository();
  });

  it('should be able to pay a job for an user', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory);
    const client = createProfileFake({ balance: 100, type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ balance: 50, type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);
    const contract = createContractFake({ client, contractor });
    await contractRepository.create(contract);
    const job = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 50, contract });
    await jobRepository.create(job);

    // Act
    await useCase.execute(job.id);

    // Assert
    const updatedClient = await profileRepository.findOneById(client.id);
    const updatedContractor = await profileRepository.findOneById(contractor.id);
    expect(updatedContractor.balance).toBeGreaterThan(contractor.balance);
    expect(updatedClient.balance).toBeLessThan(client.balance);
  });
});
