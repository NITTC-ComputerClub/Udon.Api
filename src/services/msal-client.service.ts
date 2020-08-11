import { bind, BindingScope, Provider, config } from '@loopback/core';
import { ConfidentialClientApplication } from '@azure/msal-node';

export type MsalClientOptions = {
  clientId: string;
  clientSecret: string;
  authority: string;
};

export type MsalClientService = ConfidentialClientApplication;

@bind({ scope: BindingScope.TRANSIENT })
export class MsalClientServiceProvider implements Provider<MsalClientService> {
  constructor(
    @config()
    private options: MsalClientOptions = {
      clientId: process.env['MSAL_CLIENT_ID'] ?? '',
      clientSecret: process.env['MSAL_CLIENT_SECRET'] ?? '',
      authority: process.env['MSAL_AUTHORITY'] ?? '',
    },
  ) {}

  value(): MsalClientService {
    return new ConfidentialClientApplication({
      auth: {
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        authority: this.options.authority,
      },
    });
  }
}
