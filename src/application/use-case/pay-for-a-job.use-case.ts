import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
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
    if (job.paid) {
      throw new Error('This job is already paid');
    }
    if (job.price > job.contract.client.balance) {
      throw new Error("Client's balance is not enough");
    }

    const { client, contractor } = job.contract;
    const contractorBalance = contractor.balance + job.price;
    const clientBalance = client.balance - job.price;

    await Promise.all([
      this.profileRepository.updateById(client.id, { balance: clientBalance }),
      this.profileRepository.updateById(contractor.id, { balance: contractorBalance }),
      this.jobRepository.updateOneById(jobId, { paid: JobPaidEnum.YES }),
    ]);
  }
}
