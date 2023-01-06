import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { AdminController } from '../controller/admin.controller';
import { ContractController } from '../controller/contract.controller';
import { JobController } from '../controller/job.controller';
import { ProfileController } from '../controller/profile.controller';
import { Queue } from '../queue/queue';
import { Http, HttpNext, HttpRequestWithProfile, HttpResponse } from './http';

export class Routes {
  constructor(
    private readonly http: Http,
    private readonly repositoryFactory: RepositoryFactory,
    private readonly queue: Queue
  ) {
    const contractController = new ContractController(this.repositoryFactory);
    const profileController = new ProfileController(this.repositoryFactory, this.queue);
    const jobController = new JobController(this.repositoryFactory, this.queue);
    const adminController = new AdminController(this.repositoryFactory);

    this.http.route(
      'get',
      '/api/v1/contracts',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await contractController.findAll(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'get',
      '/api/v1/contracts/:id',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await contractController.findOneById(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'post',
      '/api/v1/contracts',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await contractController.create(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'post',
      '/api/v1/profiles',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await profileController.create(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'get',
      '/api/v1/jobs/unpaid',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await jobController.unpaid(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'post',
      '/api/v1/jobs/:id/pay',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await jobController.pay(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route('post', '/api/v1/jobs', async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
      try {
        await jobController.create(req, res);
        next();
      } catch (error) {
        next(error);
      }
    });
    this.http.route(
      'post',
      '/api/v1/balances/deposit/:userId',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await profileController.depositToAClient(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'get',
      '/api/v1/admin/best-profession',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await adminController.bestProfession(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
    this.http.route(
      'get',
      '/api/v1/admin/best-clients',
      async (req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) => {
        try {
          await adminController.bestClients(req, res);
          next();
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
