import { Provider } from '@loopback/core';
import { Member } from '@nittc-computerclub/udon-common/models/member';

import fetch from 'node-fetch';

export class MembersFetcherService {
  getMembers(): Promise<Member[]> {
    return fetch(process.env['MEMBERS_DB_URL'] ?? '', {
      headers: {
        accept: 'application/vnd.github.raw+json',
        authorization: `Token ${process.env['MEMBERS_DB_TOKEN']}`,
        'user-agent': 'udon-api',
      },
    }).then(response => response.json());
  }
}

export class MembersFetcherServiceProvider
  implements Provider<MembersFetcherService> {
  constructor() {}

  async value(): Promise<MembersFetcherService> {
    return new MembersFetcherService();
  }
}
