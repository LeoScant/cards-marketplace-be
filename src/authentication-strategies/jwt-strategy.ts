import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId} from '@loopback/security';
var jwt = require('jsonwebtoken');

export class JwtStrategy implements AuthenticationStrategy {
  constructor() { }
  name: string = 'jwt';

  async authenticate(request: Request): Promise<any> {
    const token: string = this.extractCredentials(request);
    return await verifyToken(token);
  }

  private extractCredentials(request: Request) {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');
    }
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(`Authorization header is not type of 'Bearer'.`)
    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(`Authorization header has too many parts it must follow this pattern 'Bearer xx.yy.zz' where xx.yy.zz should be valid token`)
    }
    return parts[1]
  }
}

export const generateToken = async (walletAddress: string, userId: number): Promise<string> => {
  if (!walletAddress) {
    throw new HttpErrors.Unauthorized(
      'Error while generating token : userprofile is null',
    );
  }
  let token = '';
  try {
    token = await jwt.sign({walletAddress, userId, [securityId]: walletAddress}, process.env.TOKEN_SECRET_VALUE || '', {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    return token;
  } catch (err) {
    throw new HttpErrors.Unauthorized(`error generating token ${err}`);
  }
}

export const verifyToken = async (token: string): Promise<any> => {
  if (!token) {
    throw new HttpErrors.Unauthorized('Error verifying token : token is null');
  }
  try {
    const userProfile = await jwt.verify(token, process.env.TOKEN_SECRET_VALUE || '');
    return userProfile;
  } catch (err) {
    throw new HttpErrors.Unauthorized(`error verifying token ${err}`);
  }
}
