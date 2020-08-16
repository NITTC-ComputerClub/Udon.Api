import { Entity, model, property } from '@loopback/repository';
import { Member as IMember } from '@nittc-computerclub/udon-common/models/member';
import { Contacts } from '@nittc-computerclub/udon-common/models/contacts';

@model()
export class Member extends Entity implements IMember {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'object',
    required: true,
  })
  contacts: Contacts;

  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
  })
  cachedAt: Date;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}

export interface MemberRelations {
  // describe navigational properties here
}

export type MemberWithRelations = Member & MemberRelations;
