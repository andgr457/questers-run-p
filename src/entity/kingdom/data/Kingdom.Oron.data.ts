import { GAME_WORLD_IDS } from '../../world/data/World.data'
import type { KingdomEntity } from '../types/KingdomEntity.types'

export const GAME_KINGDOM_IDS = {
  ORON: 'oron',
} as const

export const GAME_KINGDOMS: KingdomEntity[] = [
  {
    id: GAME_KINGDOM_IDS.ORON,
    worldId: GAME_WORLD_IDS.AETHERRA,
    name: 'Kingdom of Oron',
    description:
      'A young frontier kingdom known for its hardy people, vast wilderness, and growing network of adventurers.',
    settlementIds: [],
  },
]