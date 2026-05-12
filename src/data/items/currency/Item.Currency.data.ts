import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const ITEM_CURRENCY_IDS = {
  GOLD: 'i_currency_gold'
}

export const ITEM_CURRENCY_GOLD: Item = {
  id: ITEM_CURRENCY_IDS.GOLD,
  name: 'Gold',
  description: 'Most accepted currency in the realm.',
  type: ITEM_TYPES.CURRENCY,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS,
  gold: {
    buy: 1,
    sell: 1
  },
}

export const ITEM_CURRENCY_ALL: Item[] = [
  ITEM_CURRENCY_GOLD
]