import { Contract } from '../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';
import { Profile } from '../../domain/entity/profile/profile';
import { ProfileTypeEnum } from '../../domain/entity/profile/profile-type.enum';

export function createContractFake(
  params?: Partial<{
    client: Partial<Profile>;
    contractor: Partial<Profile>;
    contract: Partial<Contract>;
  }>
) {
  const client = new Profile({
    firstName: 'John',
    lastName: 'Snow',
    balance: 1214,
    profession: 'Knows nothing',
    type: ProfileTypeEnum.CLIENT,
    ...params?.client,
  });
  const contractor = new Profile({
    firstName: 'Linus',
    lastName: 'Torvalds',
    balance: 451.3,
    profession: 'Programmer',
    type: ProfileTypeEnum.CONTRACTOR,
    ...params?.contractor,
  });
  return new Contract({
    terms: 'remote job contract',
    status: ContractStatusEnum.NEW,
    client,
    contractor,
    ...params?.contract,
  });
}
