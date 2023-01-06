import express from 'express';
import helmet from 'helmet';
import { Http, HttpNext, HttpRequest, HttpResponse } from './http';
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

  catchAllErrors(): void {
    this.app.use((error: any, req: HttpRequest, res: HttpResponse, next: HttpNext) => {
      let message = error.message;
      if (error.length > 0) {
        message = [];
        error.forEach((e) => {
          message.push(Object.values(e.constraints));
        });
        message = message.flat();
      }
      return res.status(400).json({ error: true, message });
    });
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
    this.applyMiddlewares(method, url, callback);
    return this.app[method](url, callback);
  }

  private applyMiddlewares(
    method: string,
    url: string,
    callback: Array<(req: any, res: any, next: any) => Promise<any>>
  ) {
    HttpMiddlewares.forEach((MiddlewareClass) => {
      const regexp = pathToRegexp(url);
      const urlMatched = MiddlewareClass.paths.some((path) => regexp.exec(path.path) && path.method === method);
      if (urlMatched) {
        const middleware = new MiddlewareClass(this.repositoryFactory);
        callback.unshift(middleware.use.bind(middleware));
      }
    });
  }
}
