import { Contract } from '../../domain/entity/contract/contract';
import { Job } from '../../domain/entity/job/job';
import { JobPaidEnum } from '../../domain/entity/job/job-paid.enum';
import { Profile } from '../../domain/entity/profile/profile';
import { createContractFake } from './create-contract.fake';

export function createJobFake(
  params?: Partial<{
    job: Partial<Job>;
    client: Partial<Profile>;
    contractor: Partial<Profile>;
    contract: Partial<Contract>;
  }>
) {
  return new Job({
    description: 'create a saas platform',
    price: 214,
    paid: JobPaidEnum.NO,
    paymentDate: new Date(2022, 11, 16),
    contract: createContractFake({
      client: params?.client,
      contractor: params?.contractor,
      contract: params?.contract,
    }),
    ...params?.job,
  });
}
