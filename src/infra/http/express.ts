import express from 'express';
import helmet from 'helmet';
import { Http } from './http';
import { HttpMiddlewares } from './middlware';
import { pathToRegexp } from 'path-to-regexp';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class ExpressHttp implements Http {
  private app: any;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(helmet());
  }

  listen(port: number = 3001): void {
    try {
      this.app.listen(port, () => {
        console.log(`🎉 App is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error(`An error occurred: ${JSON.stringify(error)}`);
      process.exit(1);
    }
  }

  route(method: string, url: string, ...callback: Array<(req: any, res: any, next: any) => Promise<any>>): any {
    this.applyMiddlewares(url, ...callback);
    return this.app[method](url, callback);
  }

  private applyMiddlewares(url: string, ...callback: Array<(req: any, res: any, next: any) => Promise<any>>) {
    HttpMiddlewares.forEach((MiddlewareClass) => {
      const regexp = pathToRegexp(url);
      if (MiddlewareClass.paths.some((url) => regexp.exec(url))) {
        const middleware = new MiddlewareClass(this.repositoryFactory);
        callback.unshift(middleware.use);
      }
    });
  }
}
