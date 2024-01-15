import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Cards, Users} from '../models';
import {CardsRepository} from '../repositories';
import {burnNFT, mintNFT, pinJSONToIPFS} from '../utils/utils';
import {LikedCardsService} from './liked-cards.service';
import {UserService} from './user.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CardService {
  constructor(
    @repository(CardsRepository)
    public cardRepository: CardsRepository,
    @service(LikedCardsService)
    public likedCardsService: LikedCardsService,
    @service(UserService)
    public userService: UserService,
  ) { }

  async getAllCards() {
    return await this.cardRepository.find({include: [{relation: 'owner', scope: {fields: {walletAddress: true}}}]});
  }

  async getCardsByOwner(userId: number) {
    return await this.cardRepository.find({where: {ownerId: userId}});
  }

  async likeCard(cardId: number, userId: number) {
    const card = await this.cardRepository.findById(cardId, {include: [{relation: 'users'}]});
    if (!card) throw new Error('Card not found');

    const userIsIncluded = card?.users?.find(
      (user: Users) => user.id === userId);

    if (userIsIncluded) await this.likedCardsService.remove(cardId, userId);

    else await this.likedCardsService.create(cardId, userId);

    return await this.userService.getLikedCards(userId);
  }

  async createCard(card: Cards, walletAddress: string, userId: number) {
    card.ownerId = userId;
    const ipfsResponse = await pinJSONToIPFS(card.title, card.description, card.imageurl)
    card.tokenId = await mintNFT(ipfsResponse.IpfsHash, walletAddress);

    return await this.cardRepository.create(card);
  }

  async deleteCard(cardId: number, userId: number) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw new Error('Card not found');
    if (card.ownerId !== userId) throw new Error('User is not the owner of the card');

    if (card.tokenId) await burnNFT(card.tokenId);
    return await this.cardRepository.deleteById(cardId);
  }

  async getCardById(cardId: number) {
    return await this.cardRepository.findById(cardId, {include: ['owner']});
  }
}
