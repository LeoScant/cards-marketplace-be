import {AuthenticationBindings, authenticate} from "@loopback/authentication";
import {inject, service} from '@loopback/core';
import {oas} from '@loopback/rest';
import {CardService} from '../services';

import {UserProfile} from "@loopback/security";
import {Cards} from '../models';

@oas.api({basePath: '/cards'})
export class CardController {
  constructor(
    @service(CardService)
    public cardService: CardService,
  ) { }

  //create a api endpoint to get all the cards using oas
  @oas.get('/', {
    responses: {
      '200': {
        description: 'Array of Card model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {'x-ts-type': CardService},
            },
          },
        },
      },
    },
  })
  async getAllCards() {
    return await this.cardService.getAllCards();
  }

  //create a api endpoint to like a card using oas
  @oas.post('{cardId}/like', {
    responses: {
      '200': {
        description: 'Like a card',
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
  @authenticate('jwt')
  async likeCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.param.path.string('cardId') cardId: number,
  ) {
    return await this.cardService.likeCard(cardId, user.walletAddress);
  }

  //create an authenticated api endpoint to create a card using oas
  @oas.post('/', {
    responses: {
      '200': {
        description: 'Create a card',
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
  @authenticate('jwt')
  async createCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.requestBody() card: Cards,
  ) {
    return await this.cardService.createCard(card, user.walletAddress);
  }

  //create an authenticated api endpoint to delete a card using oas
  @oas.del('{cardId}', {
    responses: {
      '200': {
        description: 'Delete a card',
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
  @authenticate('jwt')
  async deleteCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.param.path.string('cardId') cardId: number,
  ) {
    return await this.cardService.deleteCard(cardId, user.walletAddress);
  }
}
