import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Cards} from './cards.model';
import {Users} from './users.model';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'tradeoffers'}}
})
export class Tradeoffers extends Entity {
  @property({
    type: 'number',
    scale: 0,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO', generated: undefined},
  })
  id: number;

  @property({
    type: 'date',
    postgresql: {columnName: 'createdat', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  createdat?: string;

  @property({
    type: 'date',
    postgresql: {columnName: 'updatedat', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  updatedat?: string;
  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'cardfrom', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES', generated: undefined},
  })
  cardfrom?: number;

  @belongsTo(() => Cards, {name: 'cardToRel'})
  cardTo: number;

  @belongsTo(() => Cards, {name: 'cardFromRel'})
  cardFrom: number;

  @belongsTo(() => Users, {name: 'userFrom'})
  from: number;

  @belongsTo(() => Users, {name: 'userTo'})
  to: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tradeoffers>) {
    super(data);
  }
}

export interface TradeoffersRelations {
  // describe navigational properties here
}

export type TradeoffersWithRelations = Tradeoffers & TradeoffersRelations;
