import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_MINING_ITEM_IDS = {
  COBBLESTONE: 'i_mining_cobblestone',
  COPPER: 'i_mining_copper',
  TIN: 'i_mining_tin',
}

export const ITEM_MINING_COBBLESTONE: Item = {
  id: ITEM_MINING_ITEM_IDS.COBBLESTONE,
  name: 'Cobblestone',
  description: 'Mined stone used as the foundation for many building and crafting recipes.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'mining',
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

export const ITEM_MINING_COPPER: Item = {
  id: ITEM_MINING_ITEM_IDS.COPPER,
  name: 'Copper',
  description: 'Mined copper ore used in many crafting recipes.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'mining',
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

export const ITEM_MINING_TIN: Item = {
  id: ITEM_MINING_ITEM_IDS.TIN,
  name: 'Tin',
  description: 'Mined tin ore used in many crafting recipes.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: {
    type: 'mining',
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

export const ITEM_MINING_ALL: Item[] = [
  ITEM_MINING_COBBLESTONE,
  ITEM_MINING_COPPER,
  ITEM_MINING_TIN,
]