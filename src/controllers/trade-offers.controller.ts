import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {oas} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TradeOffersService} from '../services';

@oas.api({basePath: '/trades'})
@authenticate('jwt')
export class TradeOffersController {
  constructor(
    @service(TradeOffersService)
    public tradeOffersService: TradeOffersService,
  ) { }

  @oas.get('/')
  async getTradeOffersByUserTo(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
  ) {
    return await this.tradeOffersService.getTradeOffersByUserTo(user.userId);
  }

  @oas.post('/')
  async createTradeOffer(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.requestBody() body: {cardFrom: number, cardTo: number},
  ) {
    return await this.tradeOffersService.createTradeOffer(body.cardFrom, body.cardTo, user.userId);
  }

  @oas.post('/{tradeOfferId}/accept')
  async acceptTradeOffer(
    @inject(AuthenticationBindings.CURRENT_USER) user: UserProfile,
    @oas.param.path.number('tradeOfferId') tradeOfferId: number,
  ) {
    return await this.tradeOffersService.acceptTradeOffer(tradeOfferId, user.userId);
  }
}
