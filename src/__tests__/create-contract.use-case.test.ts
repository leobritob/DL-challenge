import { RepositoryFactory } from '../domain/repository/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { CreateContractUseCase } from '../application/use-case/create-contract.use-case';
import { DatabaseConnection } from '../infra/database/database';
import { MemoryDatabase } from '../infra/database/memory/database';
import { MemoryRepositoryFactory } from '../infra/database/memory/repository.factory';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { createProfileFake } from './helper/create-profile.fake';
import { ProfileRepository } from '../domain/repository/profile.repository';

describe('CreateContractUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let profileRepository: ProfileRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    profileRepository = repositoryFactory.createProfileRepository();
  });

  it('should be able to create a new contract', async () => {
    // Arrange
    const useCase = new CreateContractUseCase(repositoryFactory);
    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);
    const data = createContractFake({ client, contractor });

    // Act
    const result = await useCase.execute(data);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });
});
