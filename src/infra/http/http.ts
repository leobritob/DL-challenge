export interface Http {
  listen(port: number): void;
  route(method: string, url: string, ...callback: Array<(req: any, res: any, next: any) => Promise<any>>): any;
}
