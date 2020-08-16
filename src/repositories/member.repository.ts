import { DefaultCrudRepository } from '@loopback/repository';
import { Member, MemberRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.id,
  MemberRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Member, dataSource);
  }

  async createOrUpdate(member: Member): Promise<Member> {
    try {
      await this.updateById(member.id, member);
      return member;
    } catch {
      // eslint-disable-next-line no-return-await
      return await this.create(member);
    }
  }
}
