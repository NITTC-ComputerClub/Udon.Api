import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Client, ClientWithRelations } from './client.model';
import { User, UserWithRelations } from './user.model';

@model({
  settings: {
    hiddenProperties: ['userId', 'clientId'],
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

  @belongsTo(() => User, { name: 'user' })
  userId?: string;

  @belongsTo(() => Client, { name: 'client' })
  clientId: string;

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  user?: UserWithRelations;
  client: ClientWithRelations;
}

export type SessionWithRelations = Session & SessionRelations;
