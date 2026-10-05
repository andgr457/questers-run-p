import type { EntityWithLevelStatsAndAttributes } from '../Entity.types';

export interface Player extends EntityWithLevelStatsAndAttributes {
  //time in milliseconds utc
  dateCreated: number
  dateSaved: number
}
