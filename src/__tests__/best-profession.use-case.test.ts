import { BestProfessionUseCase } from '../application/use-case/best-profession.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createJobFake } from './helper/create-job.fake';

describe('BestProfessionUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to return the best profession', async () => {
    // Arrange
    const useCase = new BestProfessionUseCase(repositoryFactory);
    useCase.jobRepository.create(
      createJobFake({
        job: { price: 100, createdAt: new Date(2022, 12, 17) },
        contractor: { profession: 'UX' },
      })
    );
    useCase.jobRepository.create(
      createJobFake({
        job: { price: 90, createdAt: new Date(2022, 12, 17) },
        contractor: { profession: 'Programmer' },
      })
    );

    // Act
    const bestProfession = await useCase.execute({
      start: new Date(2022, 12, 17),
      end: new Date(2022, 12, 17),
      limit: 1,
    });

    // Assert
    expect(bestProfession).toBeDefined();
    expect(bestProfession[0].profession).toBe('UX');
  });
});
