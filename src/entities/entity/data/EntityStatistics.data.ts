import type { EntityBaseStats, EntityMobStats, NormalCursed } from '../types/Entity.types';

const EMPTY_NORMAL_CURSED: NormalCursed = {
  cursed: 0,
  normal: 0
}

const EMPTY_MOB_STATS: EntityMobStats = {
  bosses: {
    dungeons: EMPTY_NORMAL_CURSED,
    raids: EMPTY_NORMAL_CURSED,
    world: EMPTY_NORMAL_CURSED
  },
  cursed: 0,
  normal: 0,
}

export const GAME_STATS_BASE: EntityBaseStats = {
  achievements: 0,
  dungeons: EMPTY_NORMAL_CURSED,
  raids: EMPTY_MOB_STATS,
  members: {
    highRank: 0,
    total: 0
  },
  mobs: {
    hunted: EMPTY_MOB_STATS,
    party: EMPTY_MOB_STATS,
    quests: EMPTY_MOB_STATS
  },
  quests: {
    dungeon: 0,
    party: 0,
    raids: 0,
    solo: 0
  },
}