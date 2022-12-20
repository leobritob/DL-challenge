import { ProfileTypeEnum } from './profile-type.enum';

export interface ProfileInterface {
  id?: string;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: ProfileTypeEnum;
}
