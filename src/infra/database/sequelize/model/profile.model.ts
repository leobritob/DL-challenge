import Sequelize, { Model, Sequelize as SequelizeInstance } from 'sequelize';

export class ProfileModel extends Model {
  static initialize(sequelize: SequelizeInstance) {
    return this.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        profession: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        balance: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        type: {
          type: Sequelize.ENUM('client', 'contractor'),
          allowNull: false,
        },
      },
      { sequelize, modelName: 'Profile' }
    );
  }
}
