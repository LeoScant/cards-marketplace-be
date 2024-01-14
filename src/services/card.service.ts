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
    return await this.cardRepository.find({});
  }

  async likeCard(cardId: number, walletAddress: string) {
    const card = await this.cardRepository.findById(cardId, {include: [{relation: 'users'}]});
    if (!card) throw new Error('Card not found');
    const user = await this.userService.getUserByWalletAddress(walletAddress);
    if (!user) throw new Error('User not found');
    const userIsIncluded = card?.users?.find(
      (user: Users) => user.walletAddress === walletAddress);
    if (userIsIncluded) await this.likedCardsService.remove(cardId, user.id);
    else await this.likedCardsService.create(cardId, user.id);
    return await this.userService.getLikedCards(walletAddress);
  }

  async createCard(card: Cards, walletAddress: string) {
    const user = await this.userService.getUserByWalletAddress(walletAddress);
    if (!user) throw new Error('User not found');
    card.ownerId = user.id;
    const ipfsResponse = await pinJSONToIPFS(card.title, card.description, card.imageurl)
    card.tokenId = await mintNFT(ipfsResponse.IpfsHash, walletAddress);
    return await this.cardRepository.create(card);
  }

  async deleteCard(cardId: number, walletAddress: string) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw new Error('Card not found');
    const user = await this.userService.getUserByWalletAddress(walletAddress);
    if (!user) throw new Error('User not found');
    if (card.ownerId !== user.id) throw new Error('User is not the owner of the card');
    if (card.tokenId) await burnNFT(card.tokenId);
    return await this.cardRepository.deleteById(cardId);
  }
}
