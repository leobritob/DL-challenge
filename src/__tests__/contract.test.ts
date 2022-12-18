import { createContractFake } from './helper/create-contract.fake';
import { Profile } from '../domain/entity/profile/profile';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';
import { Contract } from '../domain/entity/contract/contract';
import { ContractStatusEnum } from '../domain/entity/contract/contract-status.enum';

describe('Contracts', () => {
  it('should be able to create a contract', () => {
    // Act
    const contract = createContractFake();

    // Assert
    expect(contract).toBeDefined();
    expect(contract.id).toBeDefined();
  });

  it('should throw an exception when either client or contractor are invalids', () => {
    // Arrange
    const invalidClient = new Profile({
      firstName: 'Linus',
      lastName: 'Torvalds',
      balance: 1214,
      profession: 'Programmer',
      type: ProfileTypeEnum.CONTRACTOR,
    });
    const invalidContractor = new Profile({
      firstName: 'John',
      lastName: 'Snow',
      balance: 451.3,
      profession: 'Knows nothing',
      type: ProfileTypeEnum.CLIENT,
    });

    // Assert
    expect(() => {
      // Act
      new Contract({
        terms: 'remote job contract',
        status: ContractStatusEnum.NEW,
        client: invalidClient,
        contractor: invalidContractor,
      });
    }).toThrowError();
  });
});
