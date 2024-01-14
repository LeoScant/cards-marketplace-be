import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {TokenServiceBindings} from '../keys';

var jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    public readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public readonly jwtExpiresIn: string
  ) { }

  async generateToken(walletAddress: string): Promise<string> {
    if (!walletAddress) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token : userprofile is null',
      );
    }
    let token = '';
    try {
      token = jwt.sign(walletAddress, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generating token ${err}`);
    }
    return token;
  }
}
