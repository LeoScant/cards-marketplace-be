import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Cards, CardsRelations, Users, LikedCards} from '../models';
import {LikedCardsRepository} from './liked-cards.repository';
import {UsersRepository} from './users.repository';

export class CardsRepository extends DefaultCrudRepository<
  Cards,
  typeof Cards.prototype.id,
  CardsRelations
> {

  public readonly users: HasManyThroughRepositoryFactory<Users, typeof Users.prototype.id,
          LikedCards,
          typeof Cards.prototype.id
        >;

  public readonly owner: BelongsToAccessor<Users, typeof Cards.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('LikedCardsRepository') protected likedCardsRepositoryGetter: Getter<LikedCardsRepository>, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Cards, dataSource);
    this.owner = this.createBelongsToAccessorFor('owner', usersRepositoryGetter,);
    this.registerInclusionResolver('owner', this.owner.inclusionResolver);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', usersRepositoryGetter, likedCardsRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
