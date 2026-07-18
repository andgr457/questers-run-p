import { GAME_KINGDOM_IDS } from '../../kingdom/data/Kingdom.Oron.data'
import type { SettlementEntity } from '../types/SettlementEntity.types'

export const GAME_SETTLEMENT_IDS = {
  ORON: 'oron',
} as const

export const GAME_SETTLEMENTS: SettlementEntity[] = [
  {
    id: GAME_SETTLEMENT_IDS.ORON,
    kingdomId: GAME_KINGDOM_IDS.ORON,
    name: 'Town of Oron',
    type: 'town',
    population: 1874,
    description:
      'A frontier town where merchants, craftsmen, and adventurers gather before setting out into the surrounding wilderness.',
    locationIds: [],
  },
]