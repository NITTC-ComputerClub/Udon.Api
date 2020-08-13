import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Member } from '@nittc-computerclub/udon-common/models/member';
import { Client, ClientWithRelations } from './client.model';

@model({
  settings: {
    hiddenProperties: ['clientId'],
  },
})
export class Session extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    generated: false,
  })
  id: string;

  @property({
    type: 'object',
    required: false,
  })
  member?: Member;

  @belongsTo(() => Client, { name: 'client' })
  clientId: string;

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  client: ClientWithRelations;
}

export type SessionWithRelations = Session & SessionRelations;
