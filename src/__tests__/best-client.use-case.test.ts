import { BestClientUseCase } from '../application/use-case/best-client.use-case';
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

describe('BestClientUseCase', () => {
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

  it('should be able to return the best client', async () => {
    // Arrange
    const useCase = new BestClientUseCase(repositoryFactory);
    const client = createProfileFake({
      firstName: 'John',
      lastName: 'Doe',
      profession: 'Manager',
      type: ProfileTypeEnum.CLIENT,
    });
    const client2 = createProfileFake({
      firstName: 'James',
      lastName: 'Smith',
      profession: 'Manager',
      type: ProfileTypeEnum.CLIENT,
    });
    const contractor = createProfileFake({ profession: 'UX', type: ProfileTypeEnum.CONTRACTOR });
    const contract = createContractFake({ client, contractor });
    const contract2 = createContractFake({ client: client2, contractor });
    const job = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 90, contract });
    const job2 = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 100, contract: contract2 });
    await Promise.all([
      profileRepository.create(client),
      profileRepository.create(client2),
      profileRepository.create(contractor),
    ]);
    await Promise.all([contractRepository.create(contract), contractRepository.create(contract2)]);
    await Promise.all([jobRepository.create(job), jobRepository.create(job2)]);

    const start = new Date();
    start.setMonth(new Date().getMonth() - 1);

    const end = new Date();
    end.setMonth(new Date().getMonth() + 1);

    // Act
    const bestClient = await useCase.execute({ start, end, limit: 1 });

    // Assert
    expect(bestClient).toBeDefined();
    expect(bestClient[0].fullName).toBe('James Smith');
  });
});
