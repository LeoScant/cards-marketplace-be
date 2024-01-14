import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Users,
  Cards,
} from '../models';
import {UsersRepository} from '../repositories';

export class UsersCardsController {
  constructor(
    @repository(UsersRepository) protected usersRepository: UsersRepository,
  ) { }

  @get('/users/{id}/cards', {
    responses: {
      '200': {
        description: 'Array of Users has many Cards',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cards)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Cards>,
  ): Promise<Cards[]> {
    return this.usersRepository.ownedCards(id).find(filter);
  }

  @post('/users/{id}/cards', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cards)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Users.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cards, {
            title: 'NewCardsInUsers',
            exclude: ['id'],
            optional: ['ownerId']
          }),
        },
      },
    }) cards: Omit<Cards, 'id'>,
  ): Promise<Cards> {
    return this.usersRepository.ownedCards(id).create(cards);
  }

  @patch('/users/{id}/cards', {
    responses: {
      '200': {
        description: 'Users.Cards PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cards, {partial: true}),
        },
      },
    })
    cards: Partial<Cards>,
    @param.query.object('where', getWhereSchemaFor(Cards)) where?: Where<Cards>,
  ): Promise<Count> {
    return this.usersRepository.ownedCards(id).patch(cards, where);
  }

  @del('/users/{id}/cards', {
    responses: {
      '200': {
        description: 'Users.Cards DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Cards)) where?: Where<Cards>,
  ): Promise<Count> {
    return this.usersRepository.ownedCards(id).delete(where);
  }
}
