import { Profile } from '../../../domain/entity/profile/profile';
import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { DatabaseConnection } from '../../database/database';

export class ProfileRepositoryMemory implements ProfileRepository {
  profiles: Profile[];

  constructor(private readonly database: DatabaseConnection) {
    this.profiles = this.database.getModels().profiles;
  }

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

  async updateById(id: string, data: Partial<Profile>): Promise<void> {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex < 0 || !this.profiles[profileIndex]) {
      throw new Error('Profile not found');
    }
    this.profiles[profileIndex].firstName = data.firstName;
    this.profiles[profileIndex].lastName = data.lastName;
    this.profiles[profileIndex].profession = data.profession;
    this.profiles[profileIndex].balance = data.balance;
    this.profiles[profileIndex].type = data.type;
  }
}
