import { Client, expect } from '@loopback/testlab';
import { Client as IClient } from '@nittc-computerclub/udon-common/models/client';
import { UdonApiApplication } from '../..';
import { setupApplication } from './test-helper';

xdescribe('ClientsController', () => {
  let app: UdonApiApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /clients', async () => {
    const res = await client.get('/clients').expect(200);

    expect(res.body).to.be.an.Array();
    res.body.forEach((c: IClient) => {
      expect(c).to.be.an.Object();
      expect(c.id).to.be.a.String();
      expect(c.id).to.be.lengthOf(36);
      expect(c.name).to.be.a.String();
    });
  });

  it('invokes GET /clients/:id with 404 error', async () => {
    await client.get('/clients/dummy').expect(404);
  });
});
