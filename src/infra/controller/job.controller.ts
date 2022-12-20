import { CreateJobUseCase } from '../../application/use-case/create-job.use-case';
import { FindUnpaidJobsUseCase } from '../../application/use-case/find-unpaid-jobs.use-case';
import { PayForAJobUseCase } from '../../application/use-case/pay-for-a-job.use-case';
import { Job } from '../../domain/entity/job/job';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';

export class JobController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async create(req: HttpRequest, res: HttpResponse) {
    try {
      const useCase = new CreateJobUseCase(this.repositoryFactory);
      const job = await useCase.execute(
        new Job({
          description: req.body.description,
          price: req.body.price,
          paid: req.body.paid,
          paymentDate: req.body.paymentDate,
          contractId: req.body.contractId,
        })
      );
      return res.status(200).json({ job });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async pay(req: HttpRequest, res: HttpResponse) {
    const useCase = new PayForAJobUseCase(this.repositoryFactory);
    try {
      const job = await useCase.execute(req.params.id);
      return res.status(200).json({ job });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async unpaid(req: HttpRequest, res: HttpResponse) {
    const useCase = new FindUnpaidJobsUseCase(this.repositoryFactory);
    const jobs = await useCase.execute();
    return res.status(200).json({ jobs });
  }
}
