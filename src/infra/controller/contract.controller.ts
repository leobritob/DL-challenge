import { validateOrReject } from 'class-validator';
import { CreateContractUseCase } from '../../application/use-case/create-contract.use-case';
import { FindAllContractsUseCase } from '../../application/use-case/find-all-contracts.use-case';
import { FindOneContractByIdUseCase } from '../../application/use-case/find-one-contract-by-id.use-case';
import { Contract } from '../../domain/entity/contract/contract';
import { RepositoryFactory } from '../../domain/repository/repository.factory';
import { HttpRequestWithProfile, HttpResponse } from '../http/http';
import { CreateContractDto } from './dto/create-contract.dto';
import { FindOneContractByIdDto } from './dto/find-one-contract-by-id.dto';

export class ContractController {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  async findAll(req: HttpRequestWithProfile, res: HttpResponse) {
    const profile = req.profile;
    const useCase = new FindAllContractsUseCase(this.repositoryFactory);
    const contracts = await useCase.execute(profile.id);
    return res.status(200).json({ contracts });
  }

  async findOneById(req: HttpRequestWithProfile, res: HttpResponse) {
    const profile = req.profile;
    const useCase = new FindOneContractByIdUseCase(this.repositoryFactory);
    const data = new FindOneContractByIdDto({ id: req.params.id });
    await validateOrReject(data);
    const contract = await useCase.execute(data.id, profile.id);
    return res.status(200).json({ contract });
  }

  async create(req: HttpRequestWithProfile, res: HttpResponse) {
    const useCase = new CreateContractUseCase(this.repositoryFactory);
    const data = new CreateContractDto(req.body);
    await validateOrReject(data);
    const contract = await useCase.execute(new Contract(data));
    return res.status(200).json({ contract });
  }
}
