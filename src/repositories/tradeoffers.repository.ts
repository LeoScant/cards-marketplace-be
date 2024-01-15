import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Tradeoffers, TradeoffersRelations, Cards, Users} from '../models';
import {CardsRepository} from './cards.repository';
import {UsersRepository} from './users.repository';

export class TradeoffersRepository extends DefaultCrudRepository<
  Tradeoffers,
  typeof Tradeoffers.prototype.id,
  TradeoffersRelations
> {

  public readonly cardToRel: BelongsToAccessor<Cards, typeof Tradeoffers.prototype.id>;

  public readonly cardFromRel: BelongsToAccessor<Cards, typeof Tradeoffers.prototype.id>;

  public readonly userFrom: BelongsToAccessor<Users, typeof Tradeoffers.prototype.id>;

  public readonly userTo: BelongsToAccessor<Users, typeof Tradeoffers.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('CardsRepository') protected cardsRepositoryGetter: Getter<CardsRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Tradeoffers, dataSource);
    this.userTo = this.createBelongsToAccessorFor('userTo', usersRepositoryGetter,);
    this.registerInclusionResolver('userTo', this.userTo.inclusionResolver);
    this.userFrom = this.createBelongsToAccessorFor('userFrom', usersRepositoryGetter,);
    this.registerInclusionResolver('userFrom', this.userFrom.inclusionResolver);
    this.cardFromRel = this.createBelongsToAccessorFor('cardFromRel', cardsRepositoryGetter,);
    this.registerInclusionResolver('cardFromRel', this.cardFromRel.inclusionResolver);
    this.cardToRel = this.createBelongsToAccessorFor('cardToRel', cardsRepositoryGetter,);
    this.registerInclusionResolver('cardToRel', this.cardToRel.inclusionResolver);
  }
}
