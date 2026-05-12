import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'

export const HEALTH_POTION_IDS = {
  WEAK: 'i_healthpotion_1',
  COMMON: 'i_healthpotion_2',
  STRONG: 'i_healthpotion_3',
  GRAND: 'i_healthpotion_4',
  EPIC: 'i_healthpotion_5' 
}

export const ITEM_POTION_HEALTH_WEAK: Item = {
  id: HEALTH_POTION_IDS.WEAK,
  name: 'Weak Health Potion',
  description: 'Restores a small amount of HP on use.',
  type: ITEM_TYPES.CONSUMABLE,
  rarity: ITEM_RARITY.COMMON,
  gold: {
    buy: 10,
    sell: 5
  },
  stats: {
    hp: {
      name: 'HP',
      value: 20,
      hint: ''
    }
  }
}

export const ITEM_HEALTH_POTIONS: Item[] = [
  ITEM_POTION_HEALTH_WEAK,
]
