
import {CardsRepository, LikedCardsRepository, TradeoffersRepository, UsersRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function givenEmptyDatabase() {
  let cardsRepository: CardsRepository;
  let likedCardsRepository: LikedCardsRepository;
  let tradeoffersRepository: TradeoffersRepository;
  let usersRepository: UsersRepository;

  cardsRepository = new CardsRepository(
    testdb,
    async () => likedCardsRepository,
    async () => usersRepository,
  );

  likedCardsRepository = new LikedCardsRepository(
    testdb,
    async () => cardsRepository,
    async () => usersRepository,
  );

  tradeoffersRepository = new TradeoffersRepository(
    testdb,
    async () => cardsRepository,
    async () => usersRepository,
  );

  usersRepository = new UsersRepository(
    testdb,
    async () => likedCardsRepository,
    async () => cardsRepository,
  );
}
