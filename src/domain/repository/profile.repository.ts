import { Profile } from '../entity/profile/profile';

export interface ProfileRepository {
  getTransaction(): any;
  create(data: Profile): Promise<Profile>;
  findOneById(id: string): Promise<Profile>;
  updateById(id: string, data: Partial<Profile>, params: { transaction: any }): Promise<void>;
}
