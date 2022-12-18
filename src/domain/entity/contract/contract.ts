import { randomUUID } from 'node:crypto';
import { Profile } from '../profile/profile';
import { ProfileTypeEnum } from '../profile/profile-type.enum';
import { ContractStatusEnum } from './contract-status.enum';
import { ContractInterface } from './contract.interface';

export class Contract {
  private _id: string;
  private _terms: string;
  private _status: ContractStatusEnum;
  private _client: Profile;
  private _contractor: Profile;

  constructor({
    id,
    terms,
    status,
    client,
    contractor,
  }: Omit<ContractInterface, 'id'> & Partial<{ id: string }>) {
    if (client.type !== ProfileTypeEnum.CLIENT)
      throw new Error('Client must be a "client" profile type');
    if (contractor.type !== ProfileTypeEnum.CONTRACTOR)
      throw new Error('Contractor must be a "contractor" profile type');

    this._id = id || randomUUID();
    this._terms = terms;
    this._status = status;
    this._client = client;
    this._contractor = contractor;
  }

  public get id(): string {
    return this._id;
  }

  public get terms(): string {
    return this._terms;
  }

  public set terms(value: string) {
    this._terms = value;
  }

  public get status(): ContractStatusEnum {
    return this._status;
  }

  public set status(value: ContractStatusEnum) {
    this._status = value;
  }

  public get client(): Profile {
    return this._client;
  }

  public set client(value: Profile) {
    this._client = value;
  }

  public get contractor(): Profile {
    return this._contractor;
  }

  public set contractor(value: Profile) {
    this._contractor = value;
  }

  getIsActive() {
    return this._status === ContractStatusEnum.IN_PROGRESS;
  }
}
