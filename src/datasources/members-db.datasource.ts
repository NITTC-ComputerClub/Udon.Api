import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'members_db',
  connector: 'rest',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: process.env['MEMBERS_DB_URL'],
        headers: {
          accept: 'application/vnd.github.v3.raw',
          authorization: `Token ${process.env['MEMBERS_DB_TOKEN']}`,
          'user-agent': 'udon-api',
        },
      },
      functions: {
        getMembers: [],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MembersDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'members_db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.members_db', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
