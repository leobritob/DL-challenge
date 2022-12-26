import { SequelizeDatabase } from './infra/database/sequelize/database';
import { SequelizeRepositoryFactory } from './infra/database/sequelize/repository.factory';
import { ExpressHttp } from './infra/http/express';
import { Routes } from './infra/http/routes';
import * as dotenv from 'dotenv';
dotenv.config();

export async function main() {
  const database = new SequelizeDatabase();
  await database.connect();
  if (process.env.DB_SYNC === 'true') {
    await database.sync();
  }
  const repositoryFactory = new SequelizeRepositoryFactory(database);
  const http = new ExpressHttp(repositoryFactory);
  new Routes(http, repositoryFactory);
  http.listen(Number(process.env.HTTP_PORT));
}

main();
