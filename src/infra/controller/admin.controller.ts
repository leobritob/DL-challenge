import { BestClientUseCase } from '../../application/use-case/best-client.use-case';
import { BestProfessionUseCase } from '../../application/use-case/best-profession.use-case';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequest, HttpResponse } from '../http/http';

export class AdminController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async bestProfession(req: HttpRequest, res: HttpResponse) {
    const useCase = new BestProfessionUseCase(this.repositoryFactory);
    const data = await useCase.execute(req.query);
    return res.status(200).json(data);
  }

  async bestClients(req: HttpRequest, res: HttpResponse) {
    const useCase = new BestClientUseCase(this.repositoryFactory);
    const data = await useCase.execute(req.query);
    return res.status(200).json(data);
  }
}
