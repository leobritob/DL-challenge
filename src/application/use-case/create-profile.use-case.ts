import { Profile } from '../../domain/entity/profile/profile';
import { ProfileRepository } from '../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../domain/repository/repository.factory';

export class CreateProfileUseCase {
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async execute(data: Profile) {
    return this.profileRepository.create(data);
  }
}
