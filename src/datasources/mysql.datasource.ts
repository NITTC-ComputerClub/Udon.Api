import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'mysql',
  connector: 'mysql',
  host: process.env['MYSQL_HOST'] ?? 'localhost',
  port: process.env['MYSQL_PORT'] ?? 3306,
  user: process.env['MYSQL_USER'] ?? 'udon',
  password: process.env['MYSQL_PASSWORD'] ?? 'udon',
  database: process.env['MYSQL_DATABASE'] ?? 'udon',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
