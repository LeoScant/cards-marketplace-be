import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Cards, LikedCards, Users, UsersRelations} from '../models';
import {CardsRepository} from './cards.repository';
import {LikedCardsRepository} from './liked-cards.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {

  public readonly likedCards: HasManyThroughRepositoryFactory<Cards, typeof Cards.prototype.id,
    LikedCards,
    typeof Users.prototype.id
  >;

  public readonly ownedCards: HasManyRepositoryFactory<Cards, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('LikedCardsRepository') protected likedCardsRepositoryGetter: Getter<LikedCardsRepository>, @repository.getter('CardsRepository') protected cardsRepositoryGetter: Getter<CardsRepository>,
  ) {
    super(Users, dataSource);
    this.ownedCards = this.createHasManyRepositoryFactoryFor('ownedCards', cardsRepositoryGetter,);
    this.registerInclusionResolver('ownedCards', this.ownedCards.inclusionResolver);
    this.likedCards = this.createHasManyThroughRepositoryFactoryFor('likedCards', cardsRepositoryGetter, likedCardsRepositoryGetter,);
    this.registerInclusionResolver('likedCards', this.likedCards.inclusionResolver);
  }
}
