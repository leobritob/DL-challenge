import { Profile } from '../../../domain/entity/profile/profile';
import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { DatabaseConnection } from '../../database/database';
import { ProfileModel } from '../../database/sequelize/model/profile.model';

export class SequelizeProfileRepository implements ProfileRepository {
  model: typeof ProfileModel;

  constructor(private readonly database: DatabaseConnection) {
    this.model = this.database.getModels().ProfileModel;
  }

  async create(data: Profile): Promise<Profile> {
    await this.model.create({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      profession: data.profession,
      balance: data.balance,
      type: data.type,
    });
    return data;
  }

  async findOneById(id: string): Promise<Profile> {
    const res = await this.model.findByPk(id);
    if (!res) {
      throw new Error('Profile not found');
    }
    const profile = res.toJSON();
    return new Profile(profile);
  }

  async updateById(id: string, data: Partial<Profile>): Promise<void> {
    await this.model.update(data, { where: { id } });
  }
}
