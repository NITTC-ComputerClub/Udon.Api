import { Entity, model, property } from '@loopback/repository';

@model()
export class Record extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  memberId: string;

  @property({
    type: 'string',
    required: true,
  })
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
  // describe navigational properties here
}

export type RecordWithRelations = Record & RecordRelations;
