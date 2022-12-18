import { Contract } from '../domain/entity/contract/contract';
import { ContractStatusEnum } from '../domain/entity/contract/contract-status.enum';
import { Job } from '../domain/entity/job/job';
import { JobPaidEnum } from '../domain/entity/job/job-paid.enum';
import { Profile } from '../domain/entity/profile/profile';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';

describe('Job', () => {
  it('should be able to create a new job', () => {
    // Arrange
    const client = new Profile({
      firstName: 'Linus',
      lastName: 'Torvalds',
      balance: 1214,
      profession: 'Programmer',
      type: ProfileTypeEnum.CLIENT,
    });
    const contractor = new Profile({
      firstName: 'John',
      lastName: 'Snow',
      balance: 451.3,
      profession: 'Knows nothing',
      type: ProfileTypeEnum.CONTRACTOR,
    });
    const contract = new Contract({
      terms: 'remote job contract',
      status: ContractStatusEnum.NEW,
      client,
      contractor,
    });

    // Act
    const job = new Job({
      description: 'create a saas platform',
      price: 10_000,
      paid: JobPaidEnum.NO,
      paymentDate: new Date(2022, 11, 16),
      contract,
    });

    // Assert
    expect(job).toBeDefined();
    expect(job.id).toBeDefined();
  });

  it('should be able to make the payment', () => {
    // Arrange
    const clientBalance = 1_214;
    const client = new Profile({
      firstName: 'Linus',
      lastName: 'Torvalds',
      balance: clientBalance,
      profession: 'Programmer',
      type: ProfileTypeEnum.CLIENT,
    });
    const contractorBalance = 451.3;
    const contractor = new Profile({
      firstName: 'John',
      lastName: 'Snow',
      balance: contractorBalance,
      profession: 'Knows nothing',
      type: ProfileTypeEnum.CONTRACTOR,
    });
    const contract = new Contract({
      terms: 'remote job contract',
      status: ContractStatusEnum.NEW,
      client,
      contractor,
    });

    // Act
    const job = new Job({
      description: 'create a saas platform',
      price: 214,
      paid: JobPaidEnum.NO,
      paymentDate: new Date(2022, 11, 16),
      contract,
    });

    // Act
    job.pay();

    // Assert
    expect(client.balance).toBeLessThan(clientBalance);
    expect(contractor.balance).toBeGreaterThan(contractorBalance);
  });
});
