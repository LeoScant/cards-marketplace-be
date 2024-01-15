import {AuthenticationBindings, authenticate} from "@loopback/authentication";
import {inject, service} from '@loopback/core';
import {oas, param, requestBody} from '@loopback/rest';
import {UserProfile} from "@loopback/security";
import {UserService} from '../services';

@oas.api({basePath: '/users'})
export class UserController {
  constructor(
    @service(UserService)
    public userService: UserService,
  ) { }

  //create a get endpoint that given the user wallet address returns the nonce
  @oas.get('/getNonce', {
    responses: {
      '200': {
        description: 'Nonce for the user',
        content: {
          'application/json': {
            schema: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  async getNonce(
    @param.query.string('walletAddress') walletAddress: string,
  ) {
    return await this.userService.getNonce(walletAddress);
  }

  //create a post endpoint that given the user wallet address and signature logs the user in
  @oas.post('/login', {
    responses: {
      '200': {
        description: 'Login for the user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody() body: {walletAddress: string, signature: string},
  ) {
    return await this.userService.login(body.walletAddress, body.signature);
  }

  //create a get endpoint to get all user's liked cards
  @oas.get('/likedCards', {
    responses: {
      '200': {
        description: 'Get all user\'s liked cards',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getLikedCards(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
  ) {
    return await this.userService.getLikedCards(user.userId);
  }

}
