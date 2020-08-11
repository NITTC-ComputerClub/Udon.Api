import {
  MiddlewareSequence,
  RequestContext,
  SequenceActions,
  RestBindings,
} from '@loopback/rest';
import {
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { InvokeMiddleware, InvokeMiddlewareOptions } from '@loopback/express';
import { config, inject } from '@loopback/core';
import { Reject } from '@loopback/rest/src/types';

export class MySequence extends MiddlewareSequence {
  constructor(
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.REJECT)
    public reject: Reject,
    @inject(RestBindings.INVOKE_MIDDLEWARE_SERVICE)
    readonly invokeMiddleware: InvokeMiddleware,
    @config()
    readonly options: InvokeMiddlewareOptions = MiddlewareSequence.defaultOptions,
  ) {
    super(invokeMiddleware, options);
  }

  async handle(context: RequestContext) {
    try {
      const { request } = context;
      await this.authenticateRequest(request);
      return await super.handle(context);
    } catch (err) {
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 });
      }

      this.reject(context, err);
    }
  }
}
