import { DefaultCrudRepository } from '@loopback/repository';
import { Client, ClientRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Client, dataSource);
  }
}
