import { Profile } from '../../domain/entity/profile/profile';
import { ProfileTypeEnum } from '../../domain/entity/profile/profile-type.enum';

export function createProfileFake(params?: Partial<Profile>) {
  return new Profile({
    firstName: 'Linus',
    lastName: 'Torvalds',
    balance: 451.3,
    profession: 'Programmer',
    type: ProfileTypeEnum.CONTRACTOR,
    ...params,
  });
}
