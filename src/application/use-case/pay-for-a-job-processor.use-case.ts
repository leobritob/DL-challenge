import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
import { PayForAJobEventParams } from '../../domain/event/pay-for-a-job/pay-for-a-job-event-params.interface';
import { JobRepository } from '../../domain/repository/job.repository';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class PayForAJobProcessorUseCase {
  jobRepository: JobRepository;
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.jobRepository = this.repositoryFactory.createJobRepository();
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(params: PayForAJobEventParams) {
    const transaction = await this.jobRepository.getTransaction();
    try {
      const job = await this.jobRepository.findOneById(params.jobId);
      if (job.paid) {
        throw new Error('This job is already paid');
      }
      if (job.price > job.contract.client.balance) {
        throw new Error("Client's balance is not enough");
      }

      const [contractor, client] = await Promise.all([
        this.profileRepository.findOneById(params.contractorId),
        this.profileRepository.findOneById(params.clientId),
      ]);

      const contractorBalance = contractor.balance + job.price;
      const clientBalance = client.balance - job.price;

      await this.jobRepository.updateOneById(
        params.jobId,
        { paid: JobPaidEnum.YES, paymentDate: new Date() },
        { transaction }
      );
      await Promise.all([
        this.profileRepository.updateById(params.clientId, { balance: clientBalance }, { transaction }),
        this.profileRepository.updateById(params.contractorId, { balance: contractorBalance }, { transaction }),
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }
}
