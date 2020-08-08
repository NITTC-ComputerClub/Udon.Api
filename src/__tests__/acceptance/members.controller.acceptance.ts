import { Client, expect } from '@loopback/testlab';
import { UdonApiApplication } from '../..';
import { setupApplication } from './test-helper';

describe('MembersController', () => {
  let app: UdonApiApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /members', async () => {
    const res = await client.get('/members').expect(200);
    expect(res.body).to.be.an.Array();
  });

  it('invokes GET /members/:id with 404 error', async () => {
    await client.get('/members/dummy').expect(404);
  });
});
