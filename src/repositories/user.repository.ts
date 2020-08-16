import { Getter, inject } from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import { Member, User, UserRelations } from '../models';
import { MysqlDataSource } from '../datasources';
import { MemberRepository } from './member.repository';
import { Member as IMember } from '@nittc-computerclub/udon-common/models/member';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly member: BelongsToAccessor<Member, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter(MemberRepository)
    public memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(User, dataSource);

    this.member = this.createBelongsToAccessorFor(
      'member',
      this.memberRepositoryGetter,
    );

    this.registerInclusionResolver('member', this.member.inclusionResolver);
  }

  async findOneOrCreateByMember(member: IMember) {
    return (
      (await this.findOne({
        where: {
          memberId: member.id,
        },
      })) ??
      // eslint-disable-next-line no-return-await
      (await this.create(User.create(member)))
    );
  }
}
