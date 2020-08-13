import {
  Entity,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  post,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { Client } from '../models';
import { ClientRepository, SessionRepository } from '../repositories';
import { inject } from '@loopback/core';
import { securityId } from '@loopback/security';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { TokenService } from '@loopback/authentication';

@model()
class ClientTokenRequest extends Entity {
  @property({ type: 'string', required: true })
  clientId: string;

  @property({ type: 'string', required: true })
  clientSecret: string;
}

export class ClientsController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @get('/clients', {
    responses: {
      '200': {
        description: 'Array of Client model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Client, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Client) filter?: Filter<Client>): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @get('/clients/{id}', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Client, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Client, { exclude: 'where' })
    filter?: FilterExcludingWhere<Client>,
  ): Promise<Client> {
    return this.clientRepository.findById(id, filter);
  }

  @post('/clients/token')
  async clientToken(
    @requestBody() tokenRequest: ClientTokenRequest,
  ): Promise<{ token: string }> {
    const client = await this.clientRepository.findOne({
      where: {
        id: tokenRequest.clientId,
        secret: tokenRequest.clientSecret,
      },
    });

    if (client === null) {
      throw new HttpErrors.Unauthorized('Invalid credentials.');
    }

    const session = await this.sessionRepository.create({
      clientId: client.id,
    });

    return {
      token: await this.jwtService.generateToken({
        [securityId]: session.id,
      }),
    };
  }
}
