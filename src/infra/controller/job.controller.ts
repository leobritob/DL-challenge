import { CreateJobUseCase } from '../../application/use-case/create-job.use-case';
import { FindUnpaidJobsUseCase } from '../../application/use-case/find-unpaid-jobs.use-case';
import { PayForAJobProcessorUseCase } from '../../application/use-case/pay-for-a-job-processor.use-case';
import { PayForAJobUseCase } from '../../application/use-case/pay-for-a-job.use-case';
import { Job } from '../../domain/entity/job/job';
import { PayForAJobEvent } from '../../domain/event/pay-for-a-job/pay-for-a-job.event';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';
import { Queue } from '../queue/queue';

export class JobController {
  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.queue.consume(PayForAJobEvent.name, ({ name, params }: PayForAJobEvent) => {
      console.log(`[${name}] A message has been consumed`);
      const useCase = new PayForAJobProcessorUseCase(this.repositoryFactory);
      useCase.execute(params);
    });
  }

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
    try {
      const useCase = new PayForAJobUseCase(this.repositoryFactory, this.queue);
      await useCase.execute(req.params.id);
      return res.status(204).end();
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
