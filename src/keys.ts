import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.TOKEN_SECRET_VALUE;
  export const TOKEN_EXPIRES_IN_VALUE = '7h';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}
