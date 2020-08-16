import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin, SchemaMigrationOptions } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { AuthenticationComponent } from '@loopback/authentication';
import { JWTAuthenticationComponent } from '@loopback/authentication-jwt';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationOptions,
  AuthorizationTags,
} from '@loopback/authorization';
import { ClientRepository } from './repositories';
import { Client } from './models';
import { SessionProvider } from './security/session.provider';
import { AuthorizerProvider } from './security/authorizer';

export { ApplicationConfig };

export class UdonApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    this.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    } as AuthorizationOptions);
    this.component(AuthorizationComponent);

    this.bind('session').toProvider(SessionProvider);
    this.bind('authorizer')
      .toProvider(AuthorizerProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options);

    const clientRepository = await this.getRepository(ClientRepository);

    if ((await clientRepository.count()).count === 0) {
      const names = ['Udon.Client.Web', 'Udon.Client.Nfc'];
      const clients = await clientRepository.createAll(
        names.map(Client.create),
      );

      for (const client of clients) {
        console.log(client);
      }
    }
  }
}
