import Sequelize, { Model, Sequelize as SequelizeInstance } from 'sequelize';
import { JobModel } from './job.model';
import { ProfileModel } from './profile.model';

export class ContractModel extends Model {
  static Contractor: Sequelize.BelongsTo;
  static Client: Sequelize.BelongsTo;

  static associate() {
    ProfileModel.hasMany(ContractModel, { as: 'Contractor', foreignKey: 'ContractorId' });
    ContractModel.Contractor = ContractModel.belongsTo(ProfileModel, { as: 'Contractor', foreignKey: 'ContractorId' });
    ProfileModel.hasMany(ContractModel, { as: 'Client', foreignKey: 'ClientId' });
    ContractModel.Client = ContractModel.belongsTo(ProfileModel, { as: 'Client', foreignKey: 'ClientId' });
    ContractModel.hasMany(JobModel, { as: 'Contract', foreignKey: 'ContractId' });
  }

  static initialize(sequelize: SequelizeInstance) {
    return ContractModel.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        terms: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
        },
      },
      { sequelize, modelName: 'Contract' }
    );
  }
}
