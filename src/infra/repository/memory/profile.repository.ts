import { Profile } from '../../../domain/entity/profile/profile';
import { ProfileRepository } from '../../../domain/repository/profile.repository';

export class ProfileRepositoryMemory implements ProfileRepository {
  profiles: Profile[] = [];

  create(data: Profile): Promise<Profile> {
    this.profiles.push(data);
    return Promise.resolve(data);
  }

  findOneById(id: string): Promise<Profile> {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return Promise.resolve(profile);
  }

  updateById(id: string, data: Partial<Profile>): Promise<Profile> {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex < 0 || !this.profiles[profileIndex]) {
      throw new Error('Profile not found');
    }
    if (data.firstName) {
      this.profiles[profileIndex].firstName = data.firstName;
    }
    if (data.lastName) {
      this.profiles[profileIndex].lastName = data.lastName;
    }
    if (data.profession) {
      this.profiles[profileIndex].profession = data.profession;
    }
    if (data.balance) {
      this.profiles[profileIndex].balance = data.balance;
    }
    if (data.type) {
      this.profiles[profileIndex].type = data.type;
    }
    return Promise.resolve(this.profiles[profileIndex]);
  }
}
