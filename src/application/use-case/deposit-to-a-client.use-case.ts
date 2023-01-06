import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';
import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
import { DepositToAClientEvent } from '../../domain/event/deposit-to-a-client/deposit-to-a-client.event';
import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { Queue } from '../../infra/queue/queue';

export class DepositToAClientUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(clientId: string, amount: number) {
    const jobs = await this.jobRepository.findAll({
      paid: JobPaidEnum.YES,
      contractStatus: [ContractStatusEnum.NEW, ContractStatusEnum.IN_PROGRESS],
      clientId,
    });
    let jobsToPay = jobs.reduce((total, { price }) => (total += price), 0);
    const percentageAllowed = 1.25;
    const depositLimit = jobsToPay * percentageAllowed;
    console.log("🚀 ~ file: deposit-to-a-client.use-case.ts:27 ~ DepositToAClientUseCase ~ execute ~ depositLimit", depositLimit);

    if (amount > depositLimit) {
      throw new Error("You can't deposit more than 25% of the total of jobs you have to pay");
    }

    const event = new DepositToAClientEvent({ clientId, amount });
    await this.queue.publish(event);
  }
}
