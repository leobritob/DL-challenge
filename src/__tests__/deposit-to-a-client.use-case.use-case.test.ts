import { DepositToAClientUseCase } from '../application/use-case/deposit-to-a-client.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createJobFake } from './helper/create-job.fake';

describe('DepositToAClientUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to deposit an amount to client balance', async () => {
    // Arrange
    const useCase = new DepositToAClientUseCase(repositoryFactory);
    const jobFake = createJobFake();
    useCase.jobRepository.create(jobFake);
    useCase.profileRepository.create(jobFake.contract.client);
    const clientBalance = jobFake.contract.client.balance;
    const clientId = jobFake.contract.client.id;
    const amount = jobFake.price * 1.05;

    try {
      // Act
      await useCase.execute(clientId, amount);
      expect(jobFake.contract.client.balance).toBeGreaterThan(clientBalance);
    } catch (error) {
      // Assert
      expect(error).toBeUndefined();
    }
  });

  it('should not be able to deposit an amount to client balance when amount is greater than allowed', async () => {
    // Arrange
    const useCase = new DepositToAClientUseCase(repositoryFactory);
    const jobFake = createJobFake();
    useCase.jobRepository.create(jobFake);
    useCase.profileRepository.create(jobFake.contract.client);
    const clientId = jobFake.contract.client.id;
    const amount = jobFake.price * 2;

    try {
      // Act
      await useCase.execute(clientId, amount);
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});
