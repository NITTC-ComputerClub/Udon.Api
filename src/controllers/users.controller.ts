import {
  get,
  Response,
  RestBindings,
  param,
  post,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { inject } from '@loopback/core';
import { authenticate, TokenService } from '@loopback/authentication';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { Entity, model, property, repository } from '@loopback/repository';
import { Member } from '@nittc-computerclub/udon-common/models/member';
import { MembersFetcherService, MsalClientService } from '../services';
import { ClientRepository, SessionRepository } from '../repositories';

@model()
class TokenRequest extends Entity {
  @property({ type: 'string', required: true })
  clientId: string;

  @property({ type: 'string', required: true })
  clientSecret: string;

  @property({ type: 'string', required: true })
  redirectUri: string;

  @property({ type: 'string', required: true })
  code: string;
}

export class UsersController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject('services.MsalClientService')
    private msalClientService: MsalClientService,
    @inject('services.MembersFetcherService')
    protected membersFetcherService: MembersFetcherService,
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) {}

  @get('/users/authenticate', {
    parameters: [
      {
        name: 'redirect_uri',
        schema: { type: 'string' },
        in: 'query',
      },
    ],
    responses: {
      '302': {
        description: 'Redirects to login page',
      },
    },
  })
  async authenticate(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('redirect_uri', { required: true }) redirectUri: string,
  ): Promise<void> {
    response.redirect(
      await this.msalClientService.getAuthCodeUrl({
        redirectUri,
        scopes: [],
      }),
    );
  }

  @post('/users/token', {
    parameters: [
      {
        name: 'redirectUri',
        schema: { type: 'string' },
        in: 'query',
      },
      {
        name: 'code',
        schema: { type: 'string' },
        in: 'query',
      },
    ],
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async token(
    @requestBody() tokenRequest: TokenRequest,
  ): Promise<{ token: string }> {
    const response = await this.msalClientService.acquireTokenByCode({
      code: tokenRequest.code,
      redirectUri: tokenRequest.redirectUri,
      scopes: [],
    });

    const members = await this.membersFetcherService.getMembers();
    const member = members.find(
      m => m.contacts.office365 === response.uniqueId,
    );
    if (!member) {
      throw new HttpErrors.Forbidden();
    }

    const client = await this.clientRepository.findOne({
      where: {
        id: tokenRequest.clientId,
        secret: tokenRequest.clientSecret,
      },
    });

    if (!client) {
      throw new HttpErrors.Unauthorized(
        'Invalid credentials.'
      );
    }

    const session = await this.sessionRepository.create({
      member: member,
      clientId: client.id,
    });

    return {
      token: await this.jwtService.generateToken({
        [securityId]: session.id,
      }),
    };
  }

  @authenticate('jwt')
  @get('/users/whoami', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoami(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Member> {
    const session = await this.sessionRepository.findById(
      currentUserProfile[securityId],
    );

    if (!session.member) {
      throw new HttpErrors.NotFound('The session is created without user.');
    }

    return session.member;
  }
}
