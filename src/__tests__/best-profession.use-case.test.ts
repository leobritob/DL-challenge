import { BestProfessionUseCase } from '../application/use-case/best-profession.use-case';
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

describe('BestProfessionUseCase', () => {
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

  it('should be able to return the best profession', async () => {
    // Arrange
    const useCase = new BestProfessionUseCase(repositoryFactory);
    const client = createProfileFake({ profession: 'Manager', type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ profession: 'UX', type: ProfileTypeEnum.CONTRACTOR });
    const contractor2 = createProfileFake({ profession: 'Programmer', type: ProfileTypeEnum.CONTRACTOR });
    const contract = createContractFake({ client, contractor });
    const contract2 = createContractFake({ client, contractor: contractor2 });
    const job = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 90, contract });
    const job2 = createJobFake({ paid: JobPaidEnum.YES, paymentDate: new Date(), price: 100, contract: contract2 });
    await Promise.all([
      profileRepository.create(client),
      profileRepository.create(contractor),
      profileRepository.create(contractor2),
    ]);
    await Promise.all([contractRepository.create(contract), contractRepository.create(contract2)]);
    await Promise.all([jobRepository.create(job), jobRepository.create(job2)]);

    const start = new Date();
    start.setMonth(new Date().getMonth() - 1);

    const end = new Date();
    end.setMonth(new Date().getMonth() + 1);

    // Act
    const bestProfession = await useCase.execute({ start, end, limit: 1 });

    // Assert
    expect(bestProfession).toBeDefined();
    expect(bestProfession[0].profession).toBe('Programmer');
  });
});
