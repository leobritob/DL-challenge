import { Contract } from '../../../domain/entity/contract/contract';
import { ContractStatusEnum } from '../../../domain/entity/contract/contract-status.enum';
import { Job } from '../../../domain/entity/job/job';
import { JobPaidEnum } from '../../../domain/entity/job/job-paid.enum';
import { Profile } from '../../../domain/entity/profile/profile';
import { JobRepository } from '../../../domain/repository/job.repository';
import { DatabaseConnection } from '../../database/database';

export class JobRepositoryMemory implements JobRepository {
  jobs: Job[];
  profiles: Profile[];
  contracts: Contract[];

  constructor(private readonly database: DatabaseConnection) {
    this.jobs = this.database.getModels().jobs;
    this.profiles = this.database.getModels().profiles;
    this.contracts = this.database.getModels().contracts;
  }

  create(job: Job): Promise<Job> {
    this.jobs.push(job);
    return Promise.resolve(job);
  }

  findAll(
    params?: Partial<{
      paid: JobPaidEnum;
      contractStatus: ContractStatusEnum[];
      clientId: string;
    }>
  ): Promise<Job[]> {
    let result = [...this.jobs];
    result = result.map((r) => {
      const contract = this.contracts.find((c) => c.id === r.contractId);
      return { ...r, contract };
    });

    if (params?.paid) {
      result = result.filter((j) => j.paid === params.paid);
    }
    if (params?.contractStatus?.length) {
      result = result.filter((j) => params.contractStatus!.includes(j.contract.status));
    }
    if (params?.clientId) {
      result = result.filter((j) => j.contract.client.id === params.clientId);
    }
    return Promise.resolve(result);
  }

  findOneById(id: string): Promise<Job> {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    job.contract = this.contracts.find((c) => c.id === job.contractId);
    job.contract.client = this.profiles.find((p) => p.id === job.contract.clientId);
    job.contract.contractor = this.profiles.find((p) => p.id === job.contract.contractorId);
    return Promise.resolve(job);
  }

  async updateOneById(id: string, data: Partial<Job>) {
    const jobIndex = this.jobs.findIndex((j) => j.id === id);
    if (jobIndex < 0) {
      throw new Error('Job not found');
    }
    this.jobs[jobIndex] = { ...this.jobs[jobIndex], ...data };
  }

  bestProfession(params?: Partial<{ start: Date; end: Date; limit: number }>) {
    let jobs = [...this.jobs];

    if (params?.start && !params?.end) {
      jobs = jobs.filter((job) => job.createdAt >= params.start!);
    }
    if (params?.end && !params?.start) {
      jobs = jobs.filter((job) => job.createdAt <= params.end!);
    }
    if (params?.start && params?.end) {
      jobs = jobs.filter((job) => job.createdAt >= params.start! && job.createdAt <= params.end!);
    }

    let list = jobs
      .reduce((all: { profession: string; earned: number }[], current) => {
        const { price } = current;

        const contract = this.contracts.find((c) => c.id === current.contractId);
        const contractor = this.profiles.find((p) => p.id === contract.contractorId);
        const { profession } = contractor;

        let allIndex = all.findIndex((j) => j.profession === profession);
        if (allIndex < 0) {
          all.push({ profession, earned: 0 });
        }

        all[all.length - 1].earned += price;

        return all;
      }, [])
      .sort((a, b) => b.earned - a.earned);

    if (params?.limit) {
      list = list.slice(0, params.limit);
    }

    return Promise.resolve(list);
  }

  bestClient(params?: Partial<{ start: Date; end: Date; limit: number }>) {
    let jobs = [...this.jobs];

    if (params?.start && !params?.end) {
      jobs = jobs.filter((job) => job.createdAt >= params.start!);
    }
    if (params?.end && !params?.start) {
      jobs = jobs.filter((job) => job.createdAt <= params.end!);
    }
    if (params?.start && params?.end) {
      jobs = jobs.filter((job) => job.createdAt >= params.start! && job.createdAt <= params.end!);
    }

    let list = jobs
      .reduce((all: { id: string; fullName: string; paid: number }[], current) => {
        const contract = this.contracts.find((c) => c.id === current.contractId);
        const client = this.profiles.find((p) => p.id === contract.clientId);
        const { id, firstName, lastName } = client;

        let allIndex = all.findIndex((job) => job.id === id);
        if (allIndex < 0) {
          const fullName = `${firstName} ${lastName}`;
          all.push({ id, fullName, paid: 0 });
          allIndex = all.length - 1;
        }
        all[allIndex].paid += current.price;

        return all;
      }, [])
      .sort((a, b) => b.paid - a.paid);

    if (params?.limit) {
      list = list.slice(0, params.limit);
    }

    return Promise.resolve(list);
  }
}
