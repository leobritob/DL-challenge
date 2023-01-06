import { DepositToAClientEventParams } from '../../domain/event/deposit-to-a-client/deposit-to-a-client-event-params.interface';
import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class DepositToAClientProcessorUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(params: DepositToAClientEventParams) {
    const transaction = await this.profileRepository.getTransaction();
    try {
      const profile = await this.profileRepository.findOneById(params.clientId);
      const balance = profile.balance + params.amount;
      await this.profileRepository.updateById(params.clientId, { balance }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }
}
