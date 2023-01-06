import { validateOrReject } from 'class-validator';
import { CreateProfileUseCase } from '../../application/use-case/create-profile.use-case';
import { DepositToAClientProcessorUseCase } from '../../application/use-case/deposit-to-a-client-processor.use-case';
import { DepositToAClientUseCase } from '../../application/use-case/deposit-to-a-client.use-case';
import { Profile } from '../../domain/entity/profile/profile';
import { ProfileInterface } from '../../domain/entity/profile/profile.interface';
import { DepositToAClientEvent } from '../../domain/event/deposit-to-a-client/deposit-to-a-client.event';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';
import { Queue } from '../queue/queue';
import { CreateProfileDto } from './dto/create-profile.dto';
import { DepositToAClientDto } from './dto/deposit-to-a-client.dto';

export class ProfileController {
  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.queue.consume(DepositToAClientEvent.name, ({ params }: DepositToAClientEvent) => {
      const useCase = new DepositToAClientProcessorUseCase(this.repositoryFactory);
      useCase.execute(params);
    });
  }

  async create(req: HttpRequest, res: HttpResponse) {
    const useCase = new CreateProfileUseCase(this.repositoryFactory);
    const data = new CreateProfileDto(req.body);
    await validateOrReject(data);
    const profile = await useCase.execute(new Profile(data));
    return res.status(200).json({ profile });
  }

  async depositToAClient(req: HttpRequest, res: HttpResponse) {
    const useCase = new DepositToAClientUseCase(this.repositoryFactory, this.queue);
    const data = new DepositToAClientDto(req.body);
    await validateOrReject(data);
    await useCase.execute(req.params.userId, data.amount);
    return res.status(204).end();
  }
}
