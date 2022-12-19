import { Job } from '../../domain/entity/job/job';
import { JobRepository } from '../../domain/repository/job.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class CreateJobUseCase {
  jobRepository: JobRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
  }

  async execute(job: Job) {
    return await this.jobRepository.create(job);
  }
}
