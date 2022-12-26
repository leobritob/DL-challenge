import Sequelize, { Model, Sequelize as SequelizeInstance } from 'sequelize';
import { ContractModel } from './contract.model';

export class JobModel extends Model {
  static Contract: Sequelize.BelongsTo;

  static associate() {
    JobModel.Contract = JobModel.belongsTo(ContractModel, { as: 'Contract', foreignKey: 'ContractId' });
  }

  static initialize(sequelize: SequelizeInstance) {
    return this.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
        },
        paid: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        paymentDate: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      { sequelize, modelName: 'Job' }
    );
  }
}
