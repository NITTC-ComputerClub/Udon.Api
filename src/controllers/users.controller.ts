import {
  get,
  Response,
  RestBindings,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import { inject } from '@loopback/core';
import { authenticate, TokenService } from '@loopback/authentication';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { Entity, model, property } from '@loopback/repository';
import { MsalClientService } from '../services';

@model()
export class TokenRequest extends Entity {
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

    console.log(response.account.username);

    return {
      token: await this.jwtService.generateToken({
        [securityId]: response.uniqueId,
        name: response.idTokenClaims['name'],
        email: response.account.username,
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
  ): Promise<UserProfile> {
    return currentUserProfile;
  }
}
