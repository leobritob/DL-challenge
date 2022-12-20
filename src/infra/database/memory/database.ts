import { DatabaseConnection } from '../database';

export class MemoryDatabase implements DatabaseConnection {
  db = {
    profiles: [],
    contracts: [],
    jobs: [],
  };

  connect(): Promise<any> {
    return Promise.resolve(true);
  }

  async sync(): Promise<any> {
    this.db.profiles = [];
    this.db.contracts = [];
    this.db.jobs = [];
  }

  getDB() {
    return this.db;
  }

  getModels() {
    return this.db;
  }
}
