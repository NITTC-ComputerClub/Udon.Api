import { inject, Provider } from '@loopback/core';
import { SessionWithRelations } from '../models';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { repository } from '@loopback/repository';
import { SessionRepository } from '../repositories';

export class SessionProvider implements Provider<SessionWithRelations> {
  constructor(
    @inject(SecurityBindings.USER)
    private currentUserProfile: UserProfile,
    @repository(SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  async value(): Promise<SessionWithRelations> {
    return this.sessionRepository.findById(
      this.currentUserProfile[securityId],
      {
        include: [
          {
            relation: 'client',
          },
        ],
      },
    );
  }
}
