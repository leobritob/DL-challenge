import { randomUUID } from 'crypto';
import { DatabaseConnection } from '../database';
import { DatabaseSeeds } from '../seed';
import { ContractModel } from './model/contract.model';
import { JobModel } from './model/job.model';
import { ProfileModel } from './model/profile.model';

export class SequelizeSeeds implements DatabaseSeeds {
  private jobModel: typeof JobModel;
  private profileModel: typeof ProfileModel;
  private contractModel: typeof ContractModel;

  constructor(private readonly database: DatabaseConnection) {
    this.jobModel = this.database.getModels().JobModel;
    this.profileModel = this.database.getModels().ProfileModel;
    this.contractModel = this.database.getModels().ContractModel;
  }

  async run() {
    const [client, contractor] = await Promise.all([
      this.profileModel.create({
        id: randomUUID(),
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
      }),
      this.profileModel.create({
        id: randomUUID(),
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type: 'contractor',
      }),
    ]);
    const [contract, secondContract, thirdContract] = await Promise.all([
      this.contractModel.create({
        id: randomUUID(),
        terms: 'software development service',
        status: 'terminated',
        ClientId: client.dataValues.id,
        ContractorId: contractor.dataValues.id,
      }),
      this.contractModel.create({
        id: randomUUID(),
        terms: 'software development service',
        status: 'in_progress',
        ClientId: client.dataValues.id,
        ContractorId: contractor.dataValues.id,
      }),
      this.contractModel.create({
        id: randomUUID(),
        terms: 'software development service',
        status: 'new',
        ClientId: client.dataValues.id,
        ContractorId: contractor.dataValues.id,
      }),
    ]);
    await Promise.all([
      this.jobModel.create({
        id: randomUUID(),
        description: 'work',
        price: 121,
        paid: true,
        paymentDate: '2020-08-14T23:11:26.737Z',
        ContractId: contract.dataValues.id,
      }),
      this.jobModel.create({
        id: randomUUID(),
        description: 'work',
        price: 200,
        ContractId: secondContract.dataValues.id,
      }),
      this.jobModel.create({
        id: randomUUID(),
        description: 'work',
        price: 200,
        ContractId: thirdContract.dataValues.id,
      }),
    ]);
  }
}
