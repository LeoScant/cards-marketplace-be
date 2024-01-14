import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {LikedCards} from './liked-cards.model';
import {Users} from './users.model';

@model({settings: {idInjection: false, postgresql: {schema: 'public', table: 'cards'}}})
export class Cards extends Entity {
  @property({
    type: 'number',
    jsonSchema: {nullable: false},
    scale: 0,
    generated: true,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO', generated: undefined},
  })
  id: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: false},
    length: 255,
    postgresql: {columnName: 'title', dataType: 'character varying', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'NO', generated: undefined},
  })
  title: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: false},
    postgresql: {columnName: 'description', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: undefined},
  })
  description: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'imageurl', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  imageurl?: string;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    precision: 10,
    scale: 2,
    postgresql: {columnName: 'price', dataType: 'numeric', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'YES', generated: undefined},
  })
  price?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 100,
    postgresql: {columnName: 'category', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  category?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 50,
    postgresql: {columnName: 'condition', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  condition?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 50,
    postgresql: {columnName: 'rarity', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  rarity?: string;

  // @property({
  //   type: 'number',
  //   jsonSchema: {nullable: true},
  //   scale: 0,
  //   postgresql: {columnName: 'ownerid', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES', generated: undefined},
  // })
  // ownerid?: number;

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

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'issold', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  issold?: boolean;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    scale: 0,
    postgresql: {columnName: 'quantity', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES', generated: undefined},
  })
  quantity?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'tags', dataType: 'ARRAY', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  tags?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    postgresql: {columnName: 'tokenId', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  tokenId?: string;

  @hasMany(() => Users, {through: {model: () => LikedCards, keyFrom: 'cardId', keyTo: 'userId'}})
  users: Users[];

  @belongsTo(() => Users,)
  ownerId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Cards>) {
    super(data);
  }
}

export interface CardsRelations {
  // describe navigational properties here
}

export type CardsWithRelations = Cards & CardsRelations;
