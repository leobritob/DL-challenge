import { PayForAJobUseCase } from '../application/use-case/pay-for-a-job.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createJobFake } from './helper/create-job.fake';

describe('PayForAJobUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to pay a job for an user', async () => {
    // Arrange
    const useCase = new PayForAJobUseCase(repositoryFactory);
    const jobFake = createJobFake();
    await Promise.all([
      useCase.profileRepository.create(jobFake.contract.client),
      useCase.profileRepository.create(jobFake.contract.contractor),
    ]);
    const clientBalance = jobFake.contract.client.balance;
    const contractorBalance = jobFake.contract.contractor.balance;
    useCase.jobRepository.create(jobFake);
    const jobId = jobFake.id;

    // Act
    await useCase.execute(jobId);

    // Assert
    expect(jobFake.contract.contractor.balance).toBeGreaterThan(
      contractorBalance
    );
    expect(jobFake.contract.client.balance).toBeLessThan(clientBalance);
  });
});
