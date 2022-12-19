import { Request, Response } from 'express';
import { BestClientUseCase } from '../../application/use-case/best-client.use-case';
import { BestProfessionUseCase } from '../../application/use-case/best-profession.use-case';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class AdminController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async bestProfession(req: Request, res: Response) {
    const useCase = new BestProfessionUseCase(this.repositoryFactory);
    const data = await useCase.execute(req.query);
    return res.status(200).json(data);
  }

  async bestClients(req: Request, res: Response) {
    const useCase = new BestClientUseCase(this.repositoryFactory);
    const data = await useCase.execute(req.query);
    return res.status(200).json(data);
  }
}
