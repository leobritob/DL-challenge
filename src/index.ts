import { SequelizeDatabase } from './infra/database/sequelize/database';
import { SequelizeRepositoryFactory } from './infra/database/sequelize/repository.factory';
import { ExpressHttp } from './infra/http/express';
import { Routes } from './infra/http/routes';

export async function main() {
  const database = new SequelizeDatabase();
  await database.connect();
  const repositoryFactory = new SequelizeRepositoryFactory(database);
  const http = new ExpressHttp(repositoryFactory);
  new Routes(http, repositoryFactory);
  await http.listen(3333);
}

main();
