import { get } from '@loopback/rest';
import { inject } from '@loopback/core';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { authenticate } from '@loopback/authentication';
import { Session } from '../models';
import { repository } from '@loopback/repository';
import { SessionRepository } from '../repositories';

export class SessionsController {
  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) {}

  @authenticate('jwt')
  @get('/sessions/now', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async now(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Session> {
    return this.sessionRepository.findById(currentUserProfile[securityId], {
      include: [
        {
          relation: 'client',
        },
      ],
    });
  }
}
