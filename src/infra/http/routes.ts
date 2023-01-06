import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { AdminController } from '../controller/admin.controller';
import { ContractController } from '../controller/contract.controller';
import { JobController } from '../controller/job.controller';
import { ProfileController } from '../controller/profile.controller';
import { Queue } from '../queue/queue';
import { Http, HttpRequestWithProfile, HttpResponse } from './http';

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

    this.http.route('get', '/api/v1/contracts', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return contractController.findAll(req, res);
    });
    this.http.route('get', '/api/v1/contracts/:id', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return contractController.findOneById(req, res);
    });
    this.http.route('post', '/api/v1/contracts', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return contractController.create(req, res);
    });
    this.http.route('post', '/api/v1/profiles', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return profileController.create(req, res);
    });
    this.http.route('get', '/api/v1/jobs/unpaid', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return jobController.unpaid(req, res);
    });
    this.http.route('post', '/api/v1/jobs/:id/pay', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return jobController.pay(req, res);
    });
    this.http.route('post', '/api/v1/jobs', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return jobController.create(req, res);
    });
    this.http.route(
      'post',
      '/api/v1/balances/deposit/:userId',
      async (req: HttpRequestWithProfile, res: HttpResponse) => {
        return profileController.depositToAClient(req, res);
      }
    );
    this.http.route('get', '/api/v1/admin/best-profession', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return adminController.bestProfession(req, res);
    });
    this.http.route('get', '/api/v1/admin/best-clients', async (req: HttpRequestWithProfile, res: HttpResponse) => {
      return adminController.bestClients(req, res);
    });
  }
}
