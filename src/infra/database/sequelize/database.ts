import { DatabaseConnection } from '../database';
import path from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeModels } from './model';

export class SequelizeDatabase implements DatabaseConnection {
  models: typeof SequelizeModels;
  sequelize: Sequelize | null;

  constructor() {
    this.models = SequelizeModels;
    this.sequelize = null;
  }

  async connect(): Promise<any> {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.resolve(process.cwd(), 'src', 'infra', 'database', 'sequelize', 'database.sqlite3'),
    });

    Object.values(this.models).forEach((model) => {
      model.initialize(this.sequelize);
    });

    Object.keys(this.models)
      .filter((key) => typeof this.models[key].associate === 'function')
      .forEach((key) => {
        this.models[key].associate();
      });

    const env = process.env.NODE_ENV || 'development';
    if (env === 'test') {
      await this.sequelize.sync({ force: true });
    }
  }

  async sync() {
    // this.sequelize.sync({ force: true });
    await this.sequelize.truncate({ force: true });
  }

  getDB() {
    return this.sequelize;
  }

  getModels(): any {
    return this.models;
  }
}
