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

  it('invokes GET /members', (done: Mocha.Done) => {
    client
      .get('/members')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array();
        done();
      })
      .catch(done)
    ;
  });

  it('invokes GET /members/:id with 404 error', (done: Mocha.Done) => {
    client
      .get('/members/dummy')
      .expect(404)
      .then(() => done())
      .catch(done)
    ;
  });
});
