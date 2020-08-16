import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Member as IMember } from '@nittc-computerclub/udon-common/models/member';
import { Member } from '.';
import { Roles } from '../security/roles';

@model({
  settings: {
    hiddenProperties: ['memberId'],
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    generated: false,
  })
  id: string;

  @belongsTo(() => Member, { name: 'member' })
  memberId: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: [Roles.user],
  })
  roles: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }

  static create(member: IMember) {
    return new User({
      memberId: member.id,
    });
  }
}

export interface UserRelations {
  member: Member;
}

export type UserWithRelations = User & UserRelations;
