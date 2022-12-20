import { FindOneContractByIdUseCase } from '../application/use-case/find-one-contract-by-id.use-case';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { ContractRepository } from '../domain/repository/contract.repository';
import { ProfileRepository } from '../domain/repository/profile.repository';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { DatabaseConnection } from '../infra/database/database';
import { MemoryDatabase } from '../infra/database/memory/database';
import { MemoryRepositoryFactory } from '../infra/database/memory/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { createProfileFake } from './helper/create-profile.fake';

describe('FindOneContractByIdUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let profileRepository: ProfileRepository;
  let contractRepository: ContractRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    profileRepository = repositoryFactory.createProfileRepository();
    contractRepository = repositoryFactory.createContractRepository();
  });

  it('should be able to return a contract by an id', async () => {
    // Arrange
    const useCase = new FindOneContractByIdUseCase(repositoryFactory);

    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    // Act
    const result = await useCase.execute(contract.id, contract.clientId);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });

  it('should not be able to return a contract to a different client', async () => {
    // Arrange
    const useCase = new FindOneContractByIdUseCase(repositoryFactory);

    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    const clientId = '57fd3e8f-183d-4320-ba80-344a487c6d5d';

    try {
      // Act
      await useCase.execute(contract.id, clientId);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});
