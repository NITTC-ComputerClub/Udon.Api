import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import { Client, Member, Record, RecordRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { Getter, inject } from '@loopback/core';
import { MemberRepository } from './member.repository';
import { ClientRepository } from './client.repository';

export class RecordRepository extends DefaultCrudRepository<
  Record,
  typeof Record.prototype.id,
  RecordRelations
> {
  public readonly member: BelongsToAccessor<Member, typeof Record.prototype.id>;
  public readonly client: BelongsToAccessor<Client, typeof Record.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter(MemberRepository)
    private memberRepositoryGetter: Getter<MemberRepository>,
    @repository.getter(ClientRepository)
    private clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Record, dataSource);

    this.member = this.createBelongsToAccessorFor(
      'member',
      this.memberRepositoryGetter,
    );

    this.client = this.createBelongsToAccessorFor(
      'client',
      this.clientRepositoryGetter,
    );

    this.registerInclusionResolver('member', this.member.inclusionResolver);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
