import { Job } from '../../domain/entity/job/job';
import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';

export function createJobFake(params?: Partial<Job>) {
  return new Job({
    description: 'create a saas platform',
    price: 214,
    paid: JobPaidEnum.NO,
    paymentDate: new Date(2022, 11, 16),
    contract: params.contract,
    ...params,
  });
}
