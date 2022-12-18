import { FindAllContractsUseCase } from '../application/use-case/find-all-contracts.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createContractFake } from './helper/create-contract.fake';

describe('FindAllContractsUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to return a contract list', async () => {
    // Arrange
    const useCase = new FindAllContractsUseCase(repositoryFactory);
    const contract = createContractFake();
    await useCase.contractRepository.create(contract);
    const profileId = contract.client.id;

    // Act
    const result = await useCase.execute(profileId);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be able to return an empty contract list when there is nothing for user', async () => {
    // Arrange
    const useCase = new FindAllContractsUseCase(repositoryFactory);
    const contract = createContractFake();
    await useCase.contractRepository.create(contract);
    const profileId = '0f24e018-25ec-4c91-9634-0c34ee879237';

    // Act
    const result = await useCase.execute(profileId);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });
});
