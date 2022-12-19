import { randomUUID } from 'node:crypto';
import { Contract } from '../contract/contract';
import { JobPaidEnum } from './job-paid.enum';
import { JobInterface } from './job.interface';

export class Job {
  id: string;
  description: string;
  price: number;
  paid: JobPaidEnum;
  paymentDate: Date;
  contractId: string;
  contract: Contract;
  createdAt: Date;
  updatedAt: Date | undefined;

  constructor({ id, description, price, paid, paymentDate, contractId, contract, createdAt, updatedAt }: JobInterface) {
    this.id = id || randomUUID();
    this.description = description;
    this.price = price;
    this.paid = paid;
    this.paymentDate = paymentDate;
    this.contractId = contractId;
    this.contract = contract;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt;
  }
}
