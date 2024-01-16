import {expect, sinon} from '@loopback/testlab';
import {CardController} from '../../../controllers';
import {CardsRepository, LikedCardsRepository, TradeoffersRepository, UsersRepository} from '../../../repositories';
import {CardService, LikedCardsService, TradeOffersService, UserService} from '../../../services'; // Import the CardService

describe('CardsController', () => {
  let cardRepository: CardsRepository;
  let likedCardsRepository: LikedCardsRepository;
  let tradeoffersRepository: TradeoffersRepository;
  let userRepository: UsersRepository;

  let cardService: CardService;
  let likedCardsService: LikedCardsService;
  let tradeoffersService: TradeOffersService;
  let userService: UserService;

  describe('POST /cards', () => {
    before(givenStubbedRepository);
    before(givenStubbedService);

    it('get all cards', async () => {
      const controller = new CardController(cardService);
      const card = {
        title: 'Test',
        description: 'Test',
        imageurl: 'Test',
      };

      const findStub = cardRepository.find as sinon.SinonStub;
      findStub.resolves([card]);

      const cards = await controller.getAllCards(); // Pass the wallet address and user id as arguments
      expect(cards).to.be.eql([card]);
    });
  });

  function givenStubbedRepository() {
    cardRepository = sinon.createStubInstance(CardsRepository);
    likedCardsRepository = sinon.createStubInstance(LikedCardsRepository);
    tradeoffersRepository = sinon.createStubInstance(TradeoffersRepository);
    userRepository = sinon.createStubInstance(UsersRepository);
  }

  function givenStubbedService() {
    userService = new UserService(userRepository);
    likedCardsService = new LikedCardsService(likedCardsRepository);
    cardService = new CardService(cardRepository, likedCardsService, userService);
    tradeoffersService = new TradeOffersService(tradeoffersRepository, cardService);
  }
});
