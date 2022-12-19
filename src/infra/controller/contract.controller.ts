import { Request, Response } from 'express';
import { CreateContractUseCase } from '../../application/use-case/create-contract.use-case';
import { FindAllContractsUseCase } from '../../application/use-case/find-all-contracts.use-case';
import { FindOneContractByIdUseCase } from '../../application/use-case/find-one-contract-by-id.use-case';
import { Contract } from '../../domain/entity/contract/contract';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class ContractController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async findAll(req: Request, res: Response) {
    const profileId = req.get('profile_id');
    const useCase = new FindAllContractsUseCase(this.repositoryFactory);
    const contracts = await useCase.execute(profileId);
    return res.status(200).json({ contracts });
  }

  async findOneById(req: Request, res: Response) {
    const profileId = req.get('profile_id');
    const useCase = new FindOneContractByIdUseCase(this.repositoryFactory);
    const contract = await useCase.execute(req.params.id, profileId);
    return res.status(200).json({ contract });
  }

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateContractUseCase(this.repositoryFactory);
      const contract = await useCase.execute(
        new Contract({
          terms: req.body.terms,
          status: req.body.status,
          client: { id: req.body.clientId },
          contractor: { id: req.body.contractorId },
        })
      );
      return res.status(200).json({ contract });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }
}
