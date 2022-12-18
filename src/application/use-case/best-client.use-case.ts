import { JobRepository } from '../../domain/repository/job.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class BestClientUseCase {
  jobRepository: JobRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
  }

  async execute(params?: Partial<{ start: Date; end: Date; limit: number }>) {
    return await this.jobRepository.bestClient(params);
  }
}
