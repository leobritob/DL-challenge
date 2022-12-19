import { Contract } from '../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';

export function createContractFake(params?: Partial<Contract>) {
  return new Contract({
    terms: 'remote job contract',
    status: ContractStatusEnum.NEW,
    client: params.client,
    contractor: params.contractor,
    ...params,
  });
}
