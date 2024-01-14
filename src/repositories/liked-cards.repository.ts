import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Cards, LikedCards, LikedCardsRelations, Users} from '../models';
import {CardsRepository} from './cards.repository';
import {UsersRepository} from './users.repository';

export class LikedCardsRepository extends DefaultCrudRepository<
  LikedCards,
  typeof LikedCards.prototype.id,
  LikedCardsRelations
> {

  public readonly card: BelongsToAccessor<Cards, typeof LikedCards.prototype.id>;

  public readonly user: BelongsToAccessor<Users, typeof LikedCards.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('CardsRepository') protected cardsRepositoryGetter: Getter<CardsRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(LikedCards, dataSource);
    this.user = this.createBelongsToAccessorFor('user', usersRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.card = this.createBelongsToAccessorFor('card', cardsRepositoryGetter,);
    this.registerInclusionResolver('card', this.card.inclusionResolver);
  }
}
