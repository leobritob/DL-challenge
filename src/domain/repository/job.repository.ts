import { ContractStatusEnum } from '../entity/contract/contract-status.enum';
import { Job } from '../entity/job/job';
import { JobPaidEnum } from '../entity/job/job-paid.enum';

export interface JobRepository {
  create(job: Job): Promise<Job>;
  findAll(
    params?: Partial<{
      paid: JobPaidEnum;
      contractStatus: ContractStatusEnum[];
      clientId: string;
    }>
  ): Promise<Job[]>;
  findOneById(id: string): Promise<Job>;
  updateOneById(id: string, data: Partial<Job>): Promise<void>;
  bestProfession(
    params?: Partial<{ start: Date; end: Date; limit: number }>
  ): Promise<{ profession: string; earned: number }[]>;
  bestClient(
    params?: Partial<{ start: Date; end: Date; limit: number }>
  ): Promise<{ id: string; fullName: string; paid: number }[]>;
}
