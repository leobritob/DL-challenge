import { HttpNext, HttpRequest, HttpResponse } from '../http';

export interface HttpMiddleware {
  use(req: HttpRequest, res: HttpResponse, next: HttpNext): any;
}
