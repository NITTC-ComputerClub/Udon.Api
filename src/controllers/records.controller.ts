import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { Record, SessionWithRelations } from '../models';
import { RecordRepository, SessionRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { Roles } from '../security/roles';
import { inject } from '@loopback/core';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';

export class RecordsController {
  constructor(
    @repository(RecordRepository)
    public recordRepository: RecordRepository,
    @repository(SessionRepository)
    private sessionRepository: SessionRepository,
    @inject(SecurityBindings.USER)
    private currentUserProfile: UserProfile,
  ) {}

  @authenticate('jwt')
  @authorize({ allowedRoles: [Roles.user] })
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
    const session = await this.getCurrentSession();

    return this.recordRepository.create({
      memberId: session.user?.member.id,
      clientId: session.client.id,
    });
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: [Roles.user] })
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
    return this.recordRepository.find({
      ...filter,
      where: {
        ...filter?.where,
        memberId: (await this.getCurrentSession()).user?.member.id,
      },
    });
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: [Roles.user] })
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
    const record = await this.recordRepository.findOne({
      ...filter,
      where: {
        id,
        memberId: (await this.getCurrentSession()).user?.member.id,
      },
    });

    if (!record) {
      throw new HttpErrors.NotFound('No record with the ID found.');
    }

    return record;
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: [Roles.user] })
  @del('/records/{id}', {
    responses: {
      '204': {
        description: 'Record DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    if (
      (await this.findById(id)).memberId ===
      (await this.getCurrentSession()).user?.member.id
    ) {
      throw new HttpErrors.Forbidden(
        'You can not delete the record which is created by others.',
      );
    }
    await this.recordRepository.deleteById(id);
  }

  private getCurrentSession(): Promise<SessionWithRelations> {
    return this.sessionRepository.findById(
      this.currentUserProfile[securityId],
      {
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
      },
    );
  }
}
