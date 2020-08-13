import { inject, Getter } from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import { Client, Session, SessionRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { ClientRepository } from './client.repository';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.id,
  SessionRelations
> {
  public readonly client: BelongsToAccessor<
    Client,
    typeof Session.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter(ClientRepository)
    public clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Session, dataSource);

    this.client = this.createBelongsToAccessorFor(
      'client',
      this.clientRepositoryGetter,
    );

    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
