import { DatabaseConnection } from '../database';
import path from 'path';
import { Sequelize, Options } from 'sequelize';
import { SequelizeModels } from './model';
import { SequelizeSeeds } from './seed';

export class SequelizeDatabase implements DatabaseConnection {
  models: typeof SequelizeModels;
  sequelize: Sequelize | null;

  constructor() {
    this.models = SequelizeModels;
    this.sequelize = null;
  }

  async connect(): Promise<any> {
    let options: Options = {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };

    if (process.env.NODE_ENV === 'test') {
      options = {
        dialect: 'sqlite',
        storage: path.resolve(process.cwd(), 'src', 'infra', 'database', 'sequelize', 'database.sqlite3'),
      };
    }

    this.sequelize = new Sequelize(options);

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
    await this.sequelize.sync({ force: true });
  }

  async migrations(): Promise<any> {
    
  }

  async seeds(): Promise<any> {
    const seeds = new SequelizeSeeds(this);
    await seeds.run();
    console.log(`🎉 Database seed successfully inserted`);
  }

  getDB() {
    return this.sequelize;
  }

  getModels(): any {
    return this.models;
  }
}
