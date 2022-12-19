import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../../domain/repository/repository.factory';
import { HttpMiddleware } from './http-middleware';

export class GetProfileMiddleware implements HttpMiddleware {
  static paths = [
    '/api/v1/contracts',
    '/api/v1/contracts/:id',
    '/api/v1/profiles',
    '/api/v1/jobs/unpaid',
    '/api/v1/jobs/pay',
  ];
  profileRepositoy: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.profileRepositoy = this.repositoryFactory.createProfileRepository();
  }

  async use(req: any, res: any, next: any) {
    const profileId = req.get('profile_id');
    const profile = await this.profileRepositoy.findOneById(profileId);
    if (!profile) {
      return res.status(401).end();
    }
    req.profile = profile;
    next();
  }
}
