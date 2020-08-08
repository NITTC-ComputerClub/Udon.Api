import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const baseUrl = 'https://members-db.azurewebsites.net/';
const config = {
  name: 'members_db',
  connector: 'rest',
  baseURL: baseUrl,
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: baseUrl,
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
