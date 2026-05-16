import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_FISHING_ITEM_IDS = {
  SILVERFIN_SPRAT: 'i_fishing_silverfin_sprat',
  MOSSBACK_MINNOW: 'i_fishing_mossback_minnow',
  GLOWGILL_DARTFISH: 'i_fishing_glowgill_dartfish',
}

export const ITEM_FISHING_SILVERFIN_SPRAT: Item = {
  id: ITEM_FISHING_ITEM_IDS.SILVERFIN_SPRAT,
  name: 'Silverfin Sprat',
  description: 'A tiny shimmering fish often found in calm village ponds. Easy to catch and commonly used in simple stews.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'fishing',
    levelRequired: 0,
    timeInSeconds: 2,
    xp: 2,
    stamina: 1
  },
  gold: {
    buy: 5,
    sell: 1
  },
}

export const ITEM_FISHING_MOSSBACK_MINNOW: Item = {
  id: ITEM_FISHING_ITEM_IDS.MOSSBACK_MINNOW,
  name: 'Mossback Minnow',
  description: 'A green-scaled river fish that hides among reeds and mossy stones. Favored by beginner anglers for its slow movements.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'fishing',
    levelRequired: 0,
    timeInSeconds: 3,
    xp: 3,
    stamina: 2
  },
  gold: {
    buy: 10,
    sell: 5
  },
}

export const ITEM_FISHING_GLOWGILL_DARTFISH: Item = {
  id: ITEM_FISHING_ITEM_IDS.GLOWGILL_DARTFISH,
  name: 'Glowgill Dartfish',
  description: 'A small cave-dwelling fish with faintly glowing gills that flicker in dark waters. Considered lucky by traveling adventurers.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'fishing',
    levelRequired: 1,
    timeInSeconds: 4,
    xp: 4,
    stamina: 3
  },
  gold: {
    buy: 15,
    sell: 7
  },
}

export const ITEM_FISHING_ALL: Item[] = [
  ITEM_FISHING_SILVERFIN_SPRAT,
  ITEM_FISHING_MOSSBACK_MINNOW,
  ITEM_FISHING_GLOWGILL_DARTFISH,
]