import { getService } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { Member } from '@nittc-computerclub/udon-common/models/member';
import { MembersDbDataSource } from '../datasources';

export interface MembersFetcherService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getMembers(): Promise<Member[]>;
}

export class MembersFetcherServiceProvider
  implements Provider<MembersFetcherService> {
  constructor(
    // members_db must match the name property in the datasource json file
    @inject('datasources.members_db')
    protected dataSource: MembersDbDataSource = new MembersDbDataSource(),
  ) {}

  value(): Promise<MembersFetcherService> {
    return getService(this.dataSource);
  }
}
