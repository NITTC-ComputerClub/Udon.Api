import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { param, get, getModelSchemaRef } from '@loopback/rest';
import { Client } from '../models';
import { ClientRepository } from '../repositories';

export class ClientsController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
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
}
