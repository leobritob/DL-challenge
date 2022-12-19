export interface DatabaseConnection {
  connect(): Promise<any>;
  getDB(): any;
  getModels(): any;
  sync(): Promise<any>;
}
