import { inject, Getter } from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import { Client, Session, SessionRelations, User } from '../models';
import { MysqlDataSource } from '../datasources';
import { UserRepository } from './user.repository';
import { ClientRepository } from './client.repository';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.id,
  SessionRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Session.prototype.id>;

  public readonly client: BelongsToAccessor<
    Client,
    typeof Session.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter(UserRepository)
    public userRepositoryGetter: Getter<UserRepository>,
    @repository.getter(ClientRepository)
    public clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Session, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      this.userRepositoryGetter,
    );

    this.client = this.createBelongsToAccessorFor(
      'client',
      this.clientRepositoryGetter,
    );

    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
