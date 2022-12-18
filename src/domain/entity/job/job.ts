import { randomUUID } from 'node:crypto';
import { Contract } from '../contract/contract';
import { JobPaidEnum } from './job-paid.enum';
import { JobInterface } from './job.interface';

export class Job {
  private _id: string;
  private _description: string;
  private _price: number;
  private _paid: JobPaidEnum;
  private _paymentDate: Date;
  private _contract: Contract;
  private _createdAt: Date;
  private _updatedAt: Date | undefined;

  constructor({
    id,
    description,
    price,
    paid,
    paymentDate,
    contract,
    createdAt,
    updatedAt,
  }: Omit<JobInterface, 'id' | 'createdAt' | 'updatedAt'> &
    Partial<{ id: string; createdAt: Date; updatedAt: Date }>) {
    this._id = id || randomUUID();
    this._description = description;
    this._price = price;
    this._paid = paid;
    this._paymentDate = paymentDate;
    this._contract = contract;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get price(): number {
    return this._price;
  }

  public set price(value: number) {
    this._price = value;
  }

  public get paid(): JobPaidEnum {
    return this._paid;
  }

  public set paid(value: JobPaidEnum) {
    this._paid = value;
  }

  public get paymentDate(): Date {
    return this._paymentDate;
  }

  public set paymentDate(value: Date) {
    this._paymentDate = value;
  }

  public get contract(): Contract {
    return this._contract;
  }

  public set contract(value: Contract) {
    this._contract = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  public set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
  }

  pay() {
    if (!this.contract) {
      throw new Error('Contract is required');
    }
    if (this.price > this.contract.client.balance) {
      throw new Error("Client's balance is not enough");
    }
    this.contract.contractor.balance += this.price;
    this.contract.client.balance -= this.price;
  }
}
