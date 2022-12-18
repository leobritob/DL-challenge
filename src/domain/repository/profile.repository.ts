import { Profile } from '../entity/profile/profile';

export interface ProfileRepository {
  create(data: Profile): Promise<Profile>;
  findOneById(id: string): Promise<Profile>;
  updateById(id: string, data: Partial<Profile>): Promise<Profile>;
}
