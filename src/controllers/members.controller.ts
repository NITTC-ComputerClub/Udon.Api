import { get, HttpErrors, param } from '@loopback/rest';
import { inject } from '@loopback/core';
import { Member } from '@nittc-computerclub/udon-common/models/member';
import { MembersFetcherService } from '../services';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';

const MEMBER_RESPONSE = {
  type: 'object',
  title: 'MemberResponse',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
};

export class MembersController {
  constructor(
    @inject('services.MembersFetcherService')
    protected membersFetcherService: MembersFetcherService,
  ) {}

  @authenticate('jwt')
  @authorize({ allowedRoles: ['ROLE_USER'] })
  @get('/members', {
    responses: {
      '200': {
        description: 'All members',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: MEMBER_RESPONSE,
            },
          },
        },
      },
    },
  })
  async list(): Promise<Member[]> {
    return this.membersFetcherService.getMembers();
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['ROLE_USER'] })
  @get('/members/{id}', {
    parameters: [
      {
        name: 'id',
        schema: { type: 'string' },
        in: 'path',
      },
    ],
    responses: {
      '200': {
        description: 'A member instance',
        content: {
          'application/json': {
            schema: MEMBER_RESPONSE,
          },
        },
      },
      '404': {
        description: 'No member with the ID found',
      },
    },
  })
  async get(@param.path.string('id') id: string): Promise<Member> {
    const members = await this.membersFetcherService.getMembers();
    const member = members.find(o => o.id === id);

    if (!member) {
      throw new HttpErrors.NotFound('No member with the ID found.');
    }

    return member;
  }
}
