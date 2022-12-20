import { Profile } from '../profile/profile';
import { ContractStatusEnum } from './contract-status.enum';

export interface ContractInterface {
  id?: string;
  terms: string;
  status: ContractStatusEnum;
  client?: Profile;
  contractor?: Profile;
  clientId?: string;
  contractorId?: string;
}
