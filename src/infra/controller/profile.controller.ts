import { CreateProfileUseCase } from '../../application/use-case/create-profile.use-case';
import { DepositToAClientUseCase } from '../../application/use-case/deposit-to-a-client.use-case';
import { Profile } from '../../domain/entity/profile/profile';
import { ProfileInterface } from '../../domain/entity/profile/profile.interface';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';

export class ProfileController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async create(req: HttpRequest, res: HttpResponse) {
    try {
      const useCase = new CreateProfileUseCase(this.repositoryFactory);
      const client = await useCase.execute(new Profile(req.body as ProfileInterface));
      return res.status(200).json({ client });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async depositToAClient(req: HttpRequest, res: HttpResponse) {
    try {
      const useCase = new DepositToAClientUseCase(this.repositoryFactory);
      await useCase.execute(req.params.userId, Number(req.body.amount));
      return res.status(204).end();
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }
}
