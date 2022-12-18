import { BestClientUseCase } from '../application/use-case/best-client.use-case';
import { RepositoryFactory } from '../domain/repository/repository.factory';
import { RepositoryFactoryMemory } from '../infra/database/memory/repository.factory';
import { createJobFake } from './helper/create-job.fake';

describe('BestClientUseCase', () => {
  let repositoryFactory: RepositoryFactory;

  beforeEach(() => {
    repositoryFactory = new RepositoryFactoryMemory();
  });

  it('should be able to return the best client', async () => {
    // Arrange
    const useCase = new BestClientUseCase(repositoryFactory);
    useCase.jobRepository.create(
      createJobFake({
        job: { price: 900, paid: 1, createdAt: new Date(2022, 12, 17) },
        contractor: { profession: 'UX' },
        client: {
          firstName: 'John',
          lastName: 'Doe',
        },
      })
    );
    useCase.jobRepository.create(
      createJobFake({
        job: { price: 1000, paid: 1, createdAt: new Date(2022, 12, 17) },
        contractor: { profession: 'Programmer' },
        client: {
          firstName: 'James',
          lastName: 'Smith',
        },
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
    expect(bestProfession[0].fullName).toBe('James Smith');
  });
});
