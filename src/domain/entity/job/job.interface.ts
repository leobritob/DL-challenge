import { Contract } from '../contract/contract';
import { JobPaidEnum } from './job-paid.enum';

export interface JobInterface {
  id: string;
  description: string;
  price: number;
  paid: JobPaidEnum;
  paymentDate: Date;
  contract: Contract;
  createdAt: Date;
  updatedAt: Date;
}
