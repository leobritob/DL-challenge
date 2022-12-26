import { CreateContractUseCase } from '../../application/use-case/create-contract.use-case';
import { FindAllContractsUseCase } from '../../application/use-case/find-all-contracts.use-case';
import { FindOneContractByIdUseCase } from '../../application/use-case/find-one-contract-by-id.use-case';
import { Contract } from '../../domain/entity/contract/contract';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequestWithProfile, HttpResponse } from '../http/http';

export class ContractController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async findAll(req: HttpRequestWithProfile, res: HttpResponse) {
    try {
      const profile = req.profile;
      const useCase = new FindAllContractsUseCase(this.repositoryFactory);
      const contracts = await useCase.execute(profile.id);
      return res.status(200).json({ contracts });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async findOneById(req: HttpRequestWithProfile, res: HttpResponse) {
    try {
      const profile = req.profile;
      const useCase = new FindOneContractByIdUseCase(this.repositoryFactory);
      const contract = await useCase.execute(req.params.id, profile.id);
      return res.status(200).json({ contract });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }

  async create(req: HttpRequestWithProfile, res: HttpResponse) {
    try {
      const useCase = new CreateContractUseCase(this.repositoryFactory);
      const contract = await useCase.execute(
        new Contract({
          terms: req.body.terms,
          status: req.body.status,
          clientId: req.body.clientId,
          contractorId: req.body.contractorId,
        })
      );
      return res.status(200).json({ contract });
    } catch (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
  }
}
