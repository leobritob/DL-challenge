import { PayForAJobEvent } from '../../domain/event/pay-for-a-job/pay-for-a-job.event';
import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { Queue } from '../../infra/queue/queue';

export class PayForAJobUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(jobId: string) {
    const job = await this.jobRepository.findOneById(jobId);
    if (job.paid) {
      throw new Error('This job is already paid');
    }
    if (job.price > job.contract.client.balance) {
      throw new Error("Client's balance is not enough");
    }

    const { client, contractor } = job.contract;
    const event = new PayForAJobEvent({ jobId, clientId: client.id, contractorId: contractor.id });
    await this.queue.publish(event);
  }
}
