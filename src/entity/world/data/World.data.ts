import type { WorldEntity } from '../types/WorldEntity.types'

export const GAME_WORLD_IDS = {
  AETHERRA: 'aetherra',
} as const

export const GAME_WORLDS: WorldEntity[] = [
  {
    id: GAME_WORLD_IDS.AETHERRA,
    name: 'Aetherra',
    demonym: 'Atherran',
    ageYears: 4271,
    description:
      'An ancient world of kingdoms, forgotten civilizations, untamed wilderness, and monsters lurking beyond the reach of civilization.',
    kingdomIds: [],
  },
]