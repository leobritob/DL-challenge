import { RepositoryFactory } from '../domain/repository/repository.factory';
import { createContractFake } from './helper/create-contract.fake';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { CreateContractUseCase } from '../application/use-case/create-contract.use-case';

describe('CreateContractUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to create a new contract', async () => {
    // Arrange
    const useCase = new CreateContractUseCase(repositoryFactory);
    const data = createContractFake();

    // Act
    const result = await useCase.execute(data);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });
});
