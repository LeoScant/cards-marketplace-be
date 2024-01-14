import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Cards,
  Users,
} from '../models';
import {CardsRepository} from '../repositories';

export class CardsUsersController {
  constructor(
    @repository(CardsRepository)
    public cardsRepository: CardsRepository,
  ) { }

  @get('/cards/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to Cards',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users),
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof Cards.prototype.id,
  ): Promise<Users> {
    return this.cardsRepository.owner(id);
  }
}
