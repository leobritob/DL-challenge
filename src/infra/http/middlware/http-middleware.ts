export interface HttpMiddleware {
  use(req, res, next): any;
}
