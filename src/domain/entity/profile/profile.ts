import { randomUUID } from 'node:crypto';
import { ProfileTypeEnum } from './profile-type.enum';
import { ProfileInterface } from './profile.interface';

export class Profile {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: ProfileTypeEnum;

  constructor({ id, firstName, lastName, profession, balance, type }: ProfileInterface) {
    this.id = id || randomUUID();
    this.firstName = firstName;
    this.lastName = lastName;
    this.profession = profession;
    this.balance = balance;
    this.type = type;
  }
}
