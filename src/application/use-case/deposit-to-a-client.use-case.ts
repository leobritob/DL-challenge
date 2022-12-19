import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';
import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class DepositToAClientUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
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

    if (amount > depositLimit) {
      throw new Error("You can't deposit more than 25% of the total of jobs you have to pay");
    }
    const profile = await this.profileRepository.findOneById(clientId);
    const balance = profile.balance + amount;

    await this.profileRepository.updateById(clientId, { balance });
  }
}
