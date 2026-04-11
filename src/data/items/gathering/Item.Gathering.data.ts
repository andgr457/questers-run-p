
import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_GATHERING_ITEM_IDS = {
  STICK: 'i_gathering_stick',
  STONE_SMALL: 'i_gathering_stonesmall'
}

export const ITEM_GATHERING_STICK: Item = {
  id: ITEM_GATHERING_ITEM_IDS.STICK,
  name: 'Stick',
  description: 'Twigs or small dried branches found on forest floors everywhere.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS
}

export const ITEM_GATHERING_SMALL_STONE: Item = {
  id: ITEM_GATHERING_ITEM_IDS.STONE_SMALL,
  name: 'Small Stone',
  description: 'Small hand-sized rocks found throughout the lands.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS
}

export const ITEM_GATHERING_ALL: Item[] = [
  ITEM_GATHERING_STICK,
  ITEM_GATHERING_SMALL_STONE,
]