import { Contract } from '../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../domain/entity/contract/contract-status.enum';

export function createContractFake(params?: Partial<Contract>) {
  return new Contract({
    terms: 'remote job contract',
    status: ContractStatusEnum.NEW,
    clientId: params.clientId,
    client: params.client,
    contractorId: params.contractorId,
    contractor: params.contractor,
    ...params,
  });
}
