import { DefaultCrudRepository } from '@loopback/repository';
import { Record, RecordRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class RecordRepository extends DefaultCrudRepository<
  Record,
  typeof Record.prototype.id,
  RecordRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Record, dataSource);
  }
}
