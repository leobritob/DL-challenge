import { ProfileRepository } from '../../../domain/repository/profile.repository';
import { RepositoryFactory } from '../../../domain/repository/repository.factory';
import { HttpNext, HttpRequestWithProfile, HttpResponse } from '../http';
import { HttpMiddleware, MiddlewarePath } from './http-middleware';

export class GetProfileMiddleware implements HttpMiddleware {
  static paths: MiddlewarePath[] = [
    { method: 'get', path: '/api/v1/contracts' },
    { method: 'post', path: '/api/v1/contracts' },
    { method: 'post', path: '/api/v1/profiles' },
    { method: 'get', path: '/api/v1/contracts/:id' },
    { method: 'get', path: '/api/v1/jobs/unpaid' },
    { method: 'post', path: '/api/v1/jobs/:id/pay' },
    { method: 'post', path: '/api/v1/jobs' },
    { method: 'post', path: '/api/v1/balances/deposit/:userId' },
    { method: 'get', path: '/admin/best-profession' },
    { method: 'get', path: '/admin/best-clients' },
  ];

  private profileRepository: ProfileRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.profileRepository = this.repositoryFactory.createProfileRepository();
  }

  async use(req: HttpRequestWithProfile, res: HttpResponse, next: HttpNext) {
    try {
      const profileId = req.get('profile_id');
      const profile = await this.profileRepository.findOneById(profileId);
      req.profile = profile;
      next();
    } catch (error) {
      return res.status(401).json({ error: true, message: 'Not authorized' });
    }
  }
}
