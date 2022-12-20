import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../../domain/repository/repository.factory';
import { HttpNext, HttpRequest, HttpRequestWithProfile, HttpResponse } from '../http';
import { HttpMiddleware } from './http-middleware';

export class GetProfileMiddleware implements HttpMiddleware {
  static paths = [
    '/api/v1/contracts',
    '/api/v1/contracts/:id',
    '/api/v1/contracts',
    '/api/v1/profiles',
    '/api/v1/jobs/unpaid',
    '/api/v1/jobs/:id/pay',
    '/api/v1/jobs',
    '/api/v1/balances/deposit/:userId',
    '/admin/best-profession',
    '/admin/best-clients',
  ];
  profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async use(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const profileId = req.get('profile_id');
      const profile = await this.profileRepository.findOneById(profileId);
      (req as HttpRequestWithProfile).profile = profile;
      next();
    } catch (error) {
      return res.status(401).json({ error: true, message: 'Not authorized' });
    }
  }
}
