import { randomUUID } from 'node:crypto';
import { Profile } from '../profile/profile';
import { ProfileTypeEnum } from '../profile/profile-type.enum';
import { ContractStatusEnum } from './contract-status.enum';
import { ContractInterface } from './contract.interface';

export class Contract {
  id: string;
  terms: string;
  status: ContractStatusEnum;
  clientId: string;
  client: Profile;
  contractorId: string;
  contractor: Profile;

  constructor({ id, terms, status, client, contractor, contractorId, clientId }: ContractInterface) {
    if (client?.type && client?.type !== ProfileTypeEnum.CLIENT) {
      throw new Error('Client must be a "client" profile type');
    }
    if (contractor?.type && contractor?.type !== ProfileTypeEnum.CONTRACTOR) {
      throw new Error('Contractor must be a "contractor" profile type');
    }

    this.id = id || randomUUID();
    this.terms = terms;
    this.status = status;
    this.contractorId = contractorId;
    this.clientId = clientId;
    this.client = client;
    this.contractor = contractor;
  }

  getIsActive() {
    return this.status === ContractStatusEnum.IN_PROGRESS;
  }
}
