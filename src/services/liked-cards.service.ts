import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {LikedCards} from '../models';
import {LikedCardsRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LikedCardsService {
  constructor(
    @repository(LikedCardsRepository)
    public likedCardsRepository: LikedCardsRepository,
  ) { }

  async create(cardId: number, userId: number) {
    const likedCard = new LikedCards({cardId, userId});
    return await this.likedCardsRepository.create(likedCard);
  }

  async remove(cardId: number, userId: number) {
    const likedCard = await this.findByCardIdUserId(cardId, userId);
    if (!likedCard) throw new Error('Liked card not found')
    return await this.likedCardsRepository.deleteById(likedCard?.id);
  }

  async findByCardIdUserId(cardId: number, userId: number) {
    return await this.likedCardsRepository.findOne({where: {and: [{cardId}, {userId}]}});
  }
}
