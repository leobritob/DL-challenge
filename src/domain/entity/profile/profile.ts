import { randomUUID } from 'node:crypto';
import { ProfileTypeEnum } from './profile-type.enum';
import { ProfileInterface } from './profile.interface';

export class Profile {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _profession: string;
  private _balance: number;
  private _type: ProfileTypeEnum;

  constructor({
    id,
    firstName,
    lastName,
    profession,
    balance,
    type,
  }: Omit<ProfileInterface, 'id'> & Partial<{ id: string }>) {
    this._id = id || randomUUID();
    this._firstName = firstName;
    this._lastName = lastName;
    this._profession = profession;
    this._balance = balance;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get profession(): string {
    return this._profession;
  }

  public set profession(value: string) {
    this._profession = value;
  }

  public get balance(): number {
    return this._balance;
  }

  public set balance(value: number) {
    this._balance = value;
  }

  public get type(): ProfileTypeEnum {
    return this._type;
  }

  public set type(value: ProfileTypeEnum) {
    this._type = value;
  }
}
