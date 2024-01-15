import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TradeoffersRepository} from '../repositories';
import {getApproved, safeTransferFrom} from '../utils/utils';
import {CardService} from './card.service';

@injectable({scope: BindingScope.TRANSIENT})
export class TradeOffersService {
  constructor(
    @repository(TradeoffersRepository)
    public tradeOffersRepository: TradeoffersRepository,
    @service(CardService)
    public cardService: CardService,
  ) { }

  async getTradeOffersByUserTo(userId: number) {
    return this.tradeOffersRepository.find({where: {to: userId}, include: ['cardFromRel', 'cardToRel', 'userFrom']});
  }

  async createTradeOffer(cardFromId: number, cardToId: number, userFromId: number) {
    const cardFrom = await this.cardService.getCardById(cardFromId);
    const cardTo = await this.cardService.getCardById(cardToId);

    if (!cardFrom) throw new Error('Card from not found');
    if (!cardTo) throw new Error('Card to not found');
    if (cardFrom.ownerId !== userFromId) throw new Error('User is not the owner of the card');

    return this.tradeOffersRepository.create({cardFrom: cardFromId, cardTo: cardToId, to: cardTo.ownerId, from: userFromId});
  }

  async acceptTradeOffer(tradeOfferId: number, userToId: number) {
    const tradeOffer = await this.tradeOffersRepository.findById(tradeOfferId);
    if (!tradeOffer) throw new Error('Trade offer not found');
    if (tradeOffer.to !== userToId) throw new Error('User is not the userTo of the trade offer');

    const cardFrom = await this.cardService.getCardById(tradeOffer.cardFrom);
    const cardTo = await this.cardService.getCardById(tradeOffer.cardTo);

    if (!cardFrom) throw new Error('Card from not found');
    if (!cardTo) throw new Error('Card to not found');

    const cardFromOwnerId = cardFrom.ownerId;
    const cardToOwnerId = cardTo.ownerId;

    cardFrom.ownerId = cardToOwnerId;
    cardTo.ownerId = cardFromOwnerId;

    if (cardFrom.tokenId && cardTo.tokenId && cardFrom.owner.walletAddress && cardTo.owner.walletAddress) {
      const approvedAddress1 = await getApproved(cardFrom.tokenId)
      if (approvedAddress1 !== process.env.ETH_ADDRESS) throw new Error('Trade not approved');
      const approvedAddress2 = await getApproved(cardTo.tokenId)
      if (approvedAddress2 !== process.env.ETH_ADDRESS) throw new Error('Trade not approved');

      await safeTransferFrom(cardFrom.owner.walletAddress, cardTo.owner.walletAddress, cardFrom.tokenId);
      await safeTransferFrom(cardTo.owner.walletAddress, cardFrom.owner.walletAddress, cardTo.tokenId);
    }

    await this.cardService.cardRepository.updateById(cardFrom.id, {ownerId: cardToOwnerId});
    await this.cardService.cardRepository.updateById(cardTo.id, {ownerId: cardFromOwnerId});

    await this.tradeOffersRepository.deleteById(tradeOfferId);

    return {cardFrom, cardTo};
  }
}
