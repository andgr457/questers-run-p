import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'
import { EMPTY_STATS } from '../../Stats.data'

export const CURRENCY_ITEM_IDS = {
  GOLD: 'i_currency_gold'
}

export const ITEM_CURRENCY_GOLD: Item = {
  id: CURRENCY_ITEM_IDS.GOLD,
  name: 'Gold',
  description: 'Most accepted currency in the realm.',
  type: ITEM_TYPES.CURRENCY,
  rarity: ITEM_RARITY.COMMON,
  stats: EMPTY_STATS
}

export const ITEM_CURRENCIES: Item[] = [
  ITEM_CURRENCY_GOLD
]