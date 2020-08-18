import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Member } from './member.model';
import { Client } from './client.model';

@model()
export class Record extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    generated: false,
  })
  id: string;

  @belongsTo(() => Member, { name: 'member' })
  memberId: string;

  @belongsTo(() => Client, { name: 'client' })
  clientId: string;

  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
  })
  createdAt: string;

  constructor(data?: Partial<Record>) {
    super(data);
  }
}

export interface RecordRelations {
  member: Member;
  client: Client;
}

export type RecordWithRelations = Record & RecordRelations;
