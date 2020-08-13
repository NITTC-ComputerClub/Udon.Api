import { Entity, model, property } from '@loopback/repository';
import { Client as IClient } from '@nittc-computerclub/udon-common/models/client';
import cryptoRandomString from 'crypto-random-string';

@model({
  settings: {
    hiddenProperties: [
      'secret',
    ],
  },
})
export class Client extends Entity implements IClient {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  secret: string;

  constructor(data?: Partial<Client>) {
    super(data);
  }

  static create(name: string): Client {
    return new Client({
      name,
      secret: cryptoRandomString({
        length: 64,
        type: 'url-safe',
      }),
    });
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;
