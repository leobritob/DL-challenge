import { DatabaseConnection } from '../database';

export class MemoryDatabase implements DatabaseConnection {
  async connect(): Promise<any> {}
  async sync(): Promise<any> {}
  getDB() {}
  getModels() {}
}
