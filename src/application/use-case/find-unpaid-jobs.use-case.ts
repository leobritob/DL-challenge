import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';
import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
import { JobRepository } from '../../domain/repository/job.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class FindUnpaidJobsUseCase {
  jobRepository: JobRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
  }

  async execute() {
    return this.jobRepository.findAll({
      paid: JobPaidEnum.NO,
      contractStatus: [ContractStatusEnum.IN_PROGRESS, ContractStatusEnum.NEW],
    });
  }
}
