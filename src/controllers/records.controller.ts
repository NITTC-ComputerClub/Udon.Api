import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
} from '@loopback/rest';
import { Record } from '../models';
import { RecordRepository } from '../repositories';

export class RecordsController {
  constructor(
    @repository(RecordRepository)
    public recordRepository: RecordRepository,
  ) {}

  @post('/records', {
    responses: {
      '200': {
        description: 'Record model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Record) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Record, {
            title: 'NewRecord',
            exclude: ['id'],
          }),
        },
      },
    })
    record: Omit<Record, 'id'>,
  ): Promise<Record> {
    return this.recordRepository.create(record);
  }

  @get('/records', {
    responses: {
      '200': {
        description: 'Array of Record model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Record, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Record) filter?: Filter<Record>): Promise<Record[]> {
    return this.recordRepository.find(filter);
  }

  @get('/records/{id}', {
    responses: {
      '200': {
        description: 'Record model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Record, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Record, { exclude: 'where' })
    filter?: FilterExcludingWhere<Record>,
  ): Promise<Record> {
    return this.recordRepository.findById(id, filter);
  }

  @del('/records/{id}', {
    responses: {
      '204': {
        description: 'Record DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.recordRepository.deleteById(id);
  }
}
