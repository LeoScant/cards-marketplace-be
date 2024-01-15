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

  @oas.get('/all')
  async getAllCards() {
    return await this.cardService.getAllCards();
  }

  @oas.get('/')
  @authenticate('jwt')
  async getCardsByOwner(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
  ) {
    return await this.cardService.getCardsByOwner(user.userId);
  }

  @oas.post('{cardId}/like')
  @authenticate('jwt')
  async likeCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.param.path.string('cardId') cardId: number,
  ) {
    return await this.cardService.likeCard(cardId, user.userId);
  }

  @oas.post('/')
  @authenticate('jwt')
  async createCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.requestBody() card: Cards,
  ) {
    return await this.cardService.createCard(card, user.walletAddress, user.id);
  }

  @oas.del('{cardId}')
  @authenticate('jwt')
  async deleteCard(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.param.path.string('cardId') cardId: number,
  ) {
    return await this.cardService.deleteCard(cardId, user.userId);
  }
}
