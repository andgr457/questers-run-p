import { DateTime } from 'luxon';
import type { Player } from './Player.types';
import type { EntityStats } from '../Entity.types';

const STARTING_STATS: EntityStats = {
  health: {
    max: 100,
    value: 100,
  },
  mana: {
    max: 100,
    value: 100,
  },
  stamina: {
    max: 100,
    value: 100,
  }
}

export function getPlayerNew(): Player {
  const now = DateTime.utc().toMillis()
  return {
    //id auto-increments. but dont want to for single record in the table. force new player to id 1
    id: 1,
    name: 'Kick Me',
    dateCreated: now,
    dateSaved: now,
    level: 0,
    xp: {
      max: 100,
      value: 0,
    },
    health: structuredClone(STARTING_STATS.health),
    mana: structuredClone(STARTING_STATS.mana),
    stamina: structuredClone(STARTING_STATS.stamina),
    strength: 0,
    agility: 0,
    intelligence: 0,
  }
}
