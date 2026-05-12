
import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_GATHERING_ITEM_IDS = {
  STICK: 'i_gathering_stick',
  STONE_SMALL: 'i_gathering_stonesmall',
  APPLE: 'i_gathering_apple'
}

export const ITEM_GATHERING_STICK: Item = {
  id: ITEM_GATHERING_ITEM_IDS.STICK,
  name: 'Stick',
  description: 'Twigs or small dried branches found on forest floors everywhere.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: 'gathering',
  gold: {
    buy: 5,
    sell: 1
  },
}

export const ITEM_GATHERING_SMALL_STONE: Item = {
  id: ITEM_GATHERING_ITEM_IDS.STONE_SMALL,
  name: 'Small Stone',
  description: 'Small hand-sized rocks found throughout the lands.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  profession: 'gathering',
  gold: {
    buy: 5,
    sell: 1
  },
}

export const ITEM_GATHERING_APPLE: Item = {
  id: ITEM_GATHERING_ITEM_IDS.APPLE,
  name: 'Apple',
  description: 'Juicy and tasty, round-ish, red apple.',
  type: ITEM_TYPES.RESOURCE,
  rarity: ITEM_RARITY.UNCOMMON,
  profession: 'gathering',
  gold: {
    buy: 10,
    sell: 5
  },
  stats: {
    hp: {
      name: 'HP',
      value: 5,
      hint: ''
    },
    stamina: {
      name: 'STAM',
      value: 5,
      hint: ''
    }
  }
}

export const ITEM_GATHERING_ALL: Item[] = [
  ITEM_GATHERING_STICK,
  ITEM_GATHERING_SMALL_STONE,
  ITEM_GATHERING_APPLE,
]