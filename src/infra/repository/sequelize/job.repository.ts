import { Op } from 'sequelize';
import { Contract } from '../../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../../domain/entity/contract/contract-status.enum';
import { Job } from '../../../domain/entity/job/job';
import { JobPaidEnum } from '../../../domain/entity/job/job-paid.enum';
import { Profile } from '../../../domain/entity/profile/profile';
import { JobRepository } from '../../../domain/repository/job.repository';
import { DatabaseConnection } from '../../database/database';
import { ContractModel } from '../../database/sequelize/model/contract.model';
import { JobModel } from '../../database/sequelize/model/job.model';

export class SequelizeJobRepository implements JobRepository {
  model: typeof JobModel;
  db: any;

  constructor(private readonly database: DatabaseConnection) {
    this.model = this.database.getModels().JobModel;
    this.db = this.database.getDB();
  }

  async getTransaction() {
    return this.db.transaction();
  }

  async create(data: Job): Promise<Job> {
    await this.model.create(
      {
        id: data.id,
        description: data.description,
        price: data.price,
        paid: Boolean(data.paid),
        paymentDate: data.paymentDate,
        createdAt: data.createdAt,
        ContractId: data.contractId,
      },
      {
        include: [{ association: JobModel.Contract, as: 'Contract', foreignKey: 'ContractId' }],
      }
    );
    return data;
  }

  async updateOneById(id: string, data: Partial<Job>, params: { transaction: any }) {
    await this.model.update({ ...data, paymentDate: new Date() }, { where: { id }, transaction: params.transaction });
  }

  async findAll(
    params?: Partial<{ paid: JobPaidEnum; contractStatus: ContractStatusEnum[]; clientId: string }> | undefined
  ): Promise<Job[]> {
    const where: any = {};
    if (typeof params?.paid !== 'undefined') {
      where.paid = Boolean(params.paid);
    }
    const includeWhere: any = {};
    if (params?.clientId) {
      includeWhere.ClientId = params.clientId;
    }
    if (params?.contractStatus) {
      includeWhere.status = { [Op.in]: params.contractStatus };
    }

    const res = await this.model.findAll({
      where,
      include: {
        association: JobModel.Contract,
        as: 'Contract',
        where: includeWhere,
      },
    });

    return res.map((item) => {
      return new Job({
        id: item.dataValues.id,
        description: item.dataValues.description,
        price: Number(item.dataValues.price),
        paid: item.dataValues.paid,
        paymentDate: item.dataValues.paymentDate,
        createdAt: item.dataValues.createdAt,
        updatedAt: item.dataValues.updatedAt,
      } as Job);
    });
  }

  async findOneById(id: string): Promise<Job> {
    const res = await this.model.findByPk(id, {
      include: [
        {
          association: JobModel.Contract,
          as: 'Contract',
          include: [
            { association: ContractModel.Client, as: 'Client' },
            { association: ContractModel.Contractor, as: 'Contractor' },
          ],
        },
      ],
    });

    return new Job({
      id: res.dataValues.id,
      description: res.dataValues.description,
      paid: res.dataValues.paid,
      paymentDate: res.dataValues.paymentDate,
      price: Number(res.dataValues.price),
      createdAt: res.dataValues.createdAt,
      updatedAt: res.dataValues.updatedAt,
      contractId: res.dataValues.Contract.id,
      contract: new Contract({
        id: res.dataValues.Contract.id,
        terms: res.dataValues.Contract.terms,
        status: res.dataValues.Contract.status,
        clientId: res.dataValues.ClientId,
        client: new Profile(res.dataValues.Contract.Client),
        contractorId: res.dataValues.ContractorId,
        contractor: new Profile(res.dataValues.Contract.Contractor),
      }),
    });
  }

  async bestProfession(
    params?: Partial<{ start: Date; end: Date; limit: number }> | undefined
  ): Promise<{ profession: string; earned: number }[]> {
    const where: any = {};
    if (params?.start) {
      where.createdAt = { ...where.createdAt, [Op.gte]: params.start };
    }
    if (params?.end) {
      where.createdAt = { ...where.createdAt, [Op.lte]: params.end };
    }

    const res = await this.model.findAll({
      attributes: [[this.db.fn('sum', this.db.col('price')), 'earned']],
      group: ['Contract.id', 'Contract.Contractor.id'],
      include: [
        {
          association: JobModel.Contract,
          as: 'Contract',
          attributes: ['id'],
          include: [{ association: ContractModel.Contractor, as: 'Contractor', attributes: ['profession'] }],
        },
      ],
      order: this.model.sequelize.literal('earned DESC'),
      where,
      limit: params.limit,
      raw: true,
    });

    return res.map((item: any) => {
      return {
        profession: item['Contract.Contractor.profession'],
        earned: Number(item.earned),
      };
    });
  }

  async bestClient(
    params?: Partial<{ start: Date; end: Date; limit: number }> | undefined
  ): Promise<{ id: string; fullName: string; paid: number }[]> {
    const where: any = {};
    if (params?.start) {
      where.createdAt = { ...where.createdAt, [Op.gte]: params.start };
    }
    if (params?.end) {
      where.createdAt = { ...where.createdAt, [Op.lte]: params.end };
    }

    const res = await this.model.findAll({
      attributes: [[this.db.fn('sum', this.db.col('price')), 'earned']],
      group: ['Contract.id', 'Contract.Client.id'],
      include: [
        {
          association: JobModel.Contract,
          as: 'Contract',
          attributes: ['id'],
          include: [{ association: ContractModel.Client, as: 'Client', attributes: ['firstName', 'lastName'] }],
        },
      ],
      order: this.model.sequelize.literal('earned DESC'),
      where,
      limit: params.limit,
      raw: true,
    });

    return res.map((item: any) => ({
      id: item.id,
      fullName: `${item['Contract.Client.firstName']} ${item['Contract.Client.lastName']}`,
      paid: Number(item.earned),
    }));
  }
}
