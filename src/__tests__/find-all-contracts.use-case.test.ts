import { FindAllContractsUseCase } from '../application/use-case/find-all-contracts.use-case';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { ContractRepository } from '../domain/repository/contract.repository';
import { ProfileRepository } from '../domain/repository/profile.repository';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { DatabaseConnection } from '../infra/database/database';
import { MemoryDatabase } from '../infra/database/memory/database';
import { MemoryRepositoryFactory } from '../infra/database/memory/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { createProfileFake } from './helper/create-profile.fake';

describe('FindAllContractsUseCase', () => {
  let database: DatabaseConnection;
  let repositoryFactory: RepositoryFactory;
  let contractRepository: ContractRepository;
  let profileRepository: ProfileRepository;

  beforeAll(async () => {
    database = new MemoryDatabase();
    await database.connect();
  });

  beforeEach(async () => {
    await database.sync();
    repositoryFactory = new MemoryRepositoryFactory(database);
    contractRepository = repositoryFactory.createContractRepository();
    profileRepository = repositoryFactory.createProfileRepository();
  });

  it('should be able to return a contract list', async () => {
    // Arrange
    const useCase = new FindAllContractsUseCase(repositoryFactory);

    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ clientId: client.id, contractorId: contractor.id });
    await contractRepository.create(contract);

    // Act
    const result = await useCase.execute(client.id);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be able to return an empty contract list when there is nothing for user', async () => {
    // Arrange
    const useCase = new FindAllContractsUseCase(repositoryFactory);

    const client = createProfileFake({ type: ProfileTypeEnum.CLIENT });
    const contractor = createProfileFake({ type: ProfileTypeEnum.CONTRACTOR });
    await Promise.all([profileRepository.create(client), profileRepository.create(contractor)]);

    const contract = createContractFake({ client, contractor });
    await contractRepository.create(contract);

    const profileId = 'unkown-id';

    // Act
    const result = await useCase.execute(profileId);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });
});
