import { ProfileInterface } from '../../domain/entity/profile/profile.interface';

export interface Http {
  listen(port: number): void;
  route(
    method: string,
    url: string,
    ...callback: Array<(req: HttpRequest, res: HttpResponse, next: HttpNext) => Promise<any>>
  ): any;
}

export type HttpRequest = {
  query: { [key: string]: any };
  params: { [key: string]: any };
  body: { [key: string]: any };
  get: (name: string) => any;
};

export type HttpRequestWithProfile = HttpRequest & { profile: ProfileInterface };

export type HttpResponse = {
  status: (code: number) => HttpResponse;
  json: (data: any) => HttpResponse;
  end: () => HttpResponse;
};

export type HttpNext = VoidFunction;
