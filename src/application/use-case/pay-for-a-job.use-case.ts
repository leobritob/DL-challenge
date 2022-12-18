import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class PayForAJobUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(jobId: string) {
    const job = await this.jobRepository.findOneById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    job.pay();
    const { client, contractor } = job.contract;
    await Promise.all([
      this.profileRepository.updateById(client.id, client),
      this.profileRepository.updateById(contractor.id, contractor),
    ]);
  }
}
