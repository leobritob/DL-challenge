import { FindUnpaidJobsUseCase } from '../application/use-case/find-unpaid-jobs.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createJobFake } from './helper/create-job.fake';

describe('FindUnpaidJobsUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to return an unpaid jobs list', async () => {
    // Arrange
    const useCase = new FindUnpaidJobsUseCase(repositoryFactory);
    useCase.jobRepository.create(createJobFake());

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
