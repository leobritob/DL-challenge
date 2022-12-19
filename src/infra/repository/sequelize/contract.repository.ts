import { Contract } from '../../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../../domain/entity/contract/contract-status.enum';
import { ContractRepository } from '../../../domain/repository/contract.repository';
import { DatabaseConnection } from '../../database/database';
import { ContractModel } from '../../database/sequelize/model/contract.model';

export class SequelizeContractRepository implements ContractRepository {
  model: typeof ContractModel;

  constructor(private readonly database: DatabaseConnection) {
    this.model = this.database.getModels().ContractModel;
  }

  async findAll(params?: Partial<{ status: ContractStatusEnum[]; clientId: string }> | undefined): Promise<Contract[]> {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.clientId) {
      where.clientId = params.clientId;
    }
    const res = await this.model.findAll({ where });
    return res.map((item) => {
      return new Contract({
        id: item.dataValues.id,
        terms: item.dataValues.terms,
        status: item.dataValues.status,
        contractor: item.dataValues?.Contractor,
        client: item.dataValues?.Client,
      });
    });
  }

  async create(data: Contract): Promise<Contract> {
    await this.model.create({
      id: data.id,
      terms: data.terms,
      status: data.status,
      ContractorId: data.contractor.id,
      ClientId: data.client.id,
    });
    return data;
  }

  async findOneById(id: string): Promise<Contract> {
    const res = await this.model.findByPk(id, {
      include: [
        { association: ContractModel.Client, as: 'Client' },
        { association: ContractModel.Contractor, as: 'Contractor' },
      ],
    });
    if (!res) {
      throw new Error('Contract not found');
    }
    const contract = res.toJSON();
    return new Contract({
      ...contract,
      client: contract.Client,
      contractor: contract.Contractor,
    });
  }
}
