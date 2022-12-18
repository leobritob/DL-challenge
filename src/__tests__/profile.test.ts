import { Profile } from '../domain/entity/profile/profile';
import { ProfileTypeEnum } from '../domain/entity/profile/profile-type.enum';

describe('Profile', () => {
  it('should be able to create a contractor profile entity correctly', () => {
    // Arrange
    const profile = new Profile({
      firstName: 'Linus',
      lastName: 'Torvalds',
      balance: 1214,
      profession: 'Programmer',
      type: ProfileTypeEnum.CONTRACTOR,
    });

    // Assert
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
  });

  it('should be able to create a client profile entity correctly', () => {
    // Arrange
    const profile = new Profile({
      firstName: 'Linus',
      lastName: 'Torvalds',
      balance: 1214,
      profession: 'Programmer',
      type: ProfileTypeEnum.CLIENT,
    });

    // Assert
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
  });
});
