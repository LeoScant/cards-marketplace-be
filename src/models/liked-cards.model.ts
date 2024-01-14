import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Cards} from './cards.model';
import {Users} from './users.model';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'liked_cards'}}
})
export class LikedCards extends Entity {
  @property({
    type: 'number',
    scale: 0,
    generated: true,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, generated: true},
  })
  id: number;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'createdat', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  createdat?: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'updatedat', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  updatedat?: string;

  @belongsTo(() => Cards)
  cardId: number;

  @belongsTo(() => Users)
  userId: number;

  [prop: string]: any;

  constructor(data?: Partial<LikedCards>) {
    super(data);
  }
}

export interface LikedCardsRelations {
  // describe navigational properties here
}

export type LikedCardsWithRelations = LikedCards & LikedCardsRelations;
