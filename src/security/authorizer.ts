import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { inject, Provider } from '@loopback/core';
import { SessionWithRelations } from '../models';

export class AuthorizerProvider implements Provider<Authorizer> {
  constructor(
    @inject('session')
    private session: SessionWithRelations,
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const roles = [
      ...(this.session.user?.roles ?? []),
      ...this.session.client.roles,
    ];

    return metadata.allowedRoles?.some(roles.includes)
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
