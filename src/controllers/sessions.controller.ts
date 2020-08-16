import { get } from '@loopback/rest';
import { inject } from '@loopback/core';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { Session } from '../models';
import { repository } from '@loopback/repository';
import { SessionRepository } from '../repositories';
import { Roles } from '../security/roles';

export class SessionsController {
  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) {}

  @authenticate('jwt')
  @authorize({ allowedRoles: [Roles.user, Roles.client] })
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
        {
          relation: 'user',
          scope: {
            include: [
              {
                relation: 'member',
              },
            ],
          },
        },
      ],
    });
  }
}
