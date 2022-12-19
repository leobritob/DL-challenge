import { Request, Response } from 'express';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { AdminController } from '../controller/admin.controller';
import { ContractController } from '../controller/contract.controller';
import { JobController } from '../controller/job.controller';
import { ProfileController } from '../controller/profile.controller';
import { Http } from './http';

export class Routes {
  constructor(private readonly http: Http, private readonly repositoryFactory: RepositoryFactory) {
    this.http.route('get', '/api/v1/contracts', async (req: Request, res: Response) => {
      const controller = new ContractController(this.repositoryFactory);
      return controller.findAll(req, res);
    });
    this.http.route('get', '/api/v1/contracts/:id', async (req: Request, res: Response) => {
      const controller = new ContractController(this.repositoryFactory);
      return controller.findOneById(req, res);
    });
    this.http.route('post', '/api/v1/contracts', async (req: Request, res: Response) => {
      const controller = new ContractController(this.repositoryFactory);
      return controller.create(req, res);
    });
    this.http.route('post', '/api/v1/profiles', async (req: Request, res: Response) => {
      const controller = new ProfileController(this.repositoryFactory);
      return controller.create(req, res);
    });
    this.http.route('get', '/api/v1/jobs/unpaid', async (req: Request, res: Response) => {
      const controller = new JobController(this.repositoryFactory);
      return controller.unpaid(req, res);
    });
    this.http.route('post', '/api/v1/jobs/:id/pay', async (req: Request, res: Response) => {
      const controller = new JobController(this.repositoryFactory);
      return controller.pay(req, res);
    });
    this.http.route('post', '/api/v1/jobs', async (req: Request, res: Response) => {
      const controller = new JobController(this.repositoryFactory);
      return controller.create(req, res);
    });
    this.http.route('post', '/api/v1/balances/deposit/:userId', async (req: Request, res: Response) => {
      const controller = new ProfileController(this.repositoryFactory);
      return controller.depositToAClient(req, res);
    });
    this.http.route('get', '/admin/best-profession', async (req: Request, res: Response) => {
      const controller = new AdminController(this.repositoryFactory);
      return controller.bestProfession(req, res);
    });
    this.http.route('get', '/admin/best-clients', async (req: Request, res: Response) => {
      const controller = new AdminController(this.repositoryFactory);
      return controller.bestClients(req, res);
    });
  }
}
