import { FindOneContractByIdUseCase } from '../application/use-case/find-one-contract-by-id.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createContractFake } from './helper/create-contract.fake';

describe('FindOneContractByIdUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to return a contract by an id', async () => {
    // Arrange
    const useCase = new FindOneContractByIdUseCase(repositoryFactory);
    const contract = createContractFake();
    await useCase.contractRepository.create(contract);

    // Act
    const result = await useCase.execute(contract.id, contract.client.id);

    // Assert
    expect(result).toBeDefined();
    expect(result!.id).toBeDefined();
  });

  it('should not be able to return a contract to a different client', async () => {
    // Arrange
    const useCase = new FindOneContractByIdUseCase(repositoryFactory);
    const contract = createContractFake();
    await useCase.contractRepository.create(contract);
    const clientId = '57fd3e8f-183d-4320-ba80-344a487c6d5d';

    // Act
    const result = await useCase.execute(contract.id, clientId);

    // Assert
    expect(result).toBeUndefined();
  });
});
