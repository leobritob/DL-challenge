import { validate, validateOrReject } from 'class-validator';
import { CreateJobUseCase } from '../../application/use-case/create-job.use-case';
import { FindUnpaidJobsUseCase } from '../../application/use-case/find-unpaid-jobs.use-case';
import { PayForAJobProcessorUseCase } from '../../application/use-case/pay-for-a-job-processor.use-case';
import { PayForAJobUseCase } from '../../application/use-case/pay-for-a-job.use-case';
import { Job } from '../../domain/entity/job/job';
import { PayForAJobEvent } from '../../domain/event/pay-for-a-job/pay-for-a-job.event';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';
import { Queue } from '../queue/queue';
import { CreateJobDto } from './dto/create-job.dto';
import { PayForAJobDto } from './dto/pay-for-a-job.dto';

export class JobController {
  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.queue.consume(PayForAJobEvent.name, ({ params }: PayForAJobEvent) => {
      const useCase = new PayForAJobProcessorUseCase(this.repositoryFactory);
      useCase.execute(params);
    });
  }

  async create(req: HttpRequest, res: HttpResponse) {
    const useCase = new CreateJobUseCase(this.repositoryFactory);
    const data = new CreateJobDto(req.body);
    await validateOrReject(data);
    const job = await useCase.execute(new Job(data));
    return res.status(200).json({ job });
  }

  async pay(req: HttpRequest, res: HttpResponse) {
    const useCase = new PayForAJobUseCase(this.repositoryFactory, this.queue);
    const data = new PayForAJobDto({ id: req.params.id });
    await validateOrReject(data);
    await useCase.execute(data.id);
    return res.status(204).end();
  }

  async unpaid(req: HttpRequest, res: HttpResponse) {
    const useCase = new FindUnpaidJobsUseCase(this.repositoryFactory);
    const jobs = await useCase.execute();
    return res.status(200).json({ jobs });
  }
}
