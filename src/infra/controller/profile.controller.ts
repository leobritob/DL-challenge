import { CreateProfileUseCase } from '../../application/use-case/create-profile.use-case';
import { DepositToAClientProcessorUseCase } from '../../application/use-case/deposit-to-a-client-processor.use-case';
import { DepositToAClientUseCase } from '../../application/use-case/deposit-to-a-client.use-case';
import { Profile } from '../../domain/entity/profile/profile';
import { ProfileInterface } from '../../domain/entity/profile/profile.interface';
import { DepositToAClientEvent } from '../../domain/event/deposit-to-a-client/deposit-to-a-client.event';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';
import { Queue } from '../queue/queue';

export class ProfileController {
  constructor(private readonly repositoryFactory: RepositoryFactory, private readonly queue: Queue) {
    this.queue.consume(DepositToAClientEvent.name, ({ name, params }: DepositToAClientEvent) => {
      console.log(`[${name}] A message has been consumed`);
      const useCase = new DepositToAClientProcessorUseCase(this.repositoryFactory);
      useCase.execute(params);
    });
  }

  async create(req: HttpRequest, res: HttpResponse) {
    try {
      const useCase = new CreateProfileUseCase(this.repositoryFactory);
      const profile = await useCase.execute(new Profile(req.body as ProfileInterface));
      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async depositToAClient(req: HttpRequest, res: HttpResponse) {
    try {
      const useCase = new DepositToAClientUseCase(this.repositoryFactory, this.queue);
      await useCase.execute(req.params.userId, Number(req.body.amount));
      return res.status(204).end();
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }
}
