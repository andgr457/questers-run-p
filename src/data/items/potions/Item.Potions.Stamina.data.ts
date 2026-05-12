import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'

export const STAMINA_POTION_IDS = {
  WEAK: 'i_staminapotion_1',
  COMMON: 'i_staminapotion_2',
  STRONG: 'i_staminapotion_3',
  GRAND: 'i_staminapotion_4',
  EPIC: 'i_staminapotion_5' 
}

export const ITEM_POTION_STAMINA_WEAK: Item = {
  id: STAMINA_POTION_IDS.WEAK,
  name: 'Weak Mana Potion',
  description: 'Restores a small amount of stamina on use.',
  type: ITEM_TYPES.CONSUMABLE,
  rarity: ITEM_RARITY.COMMON,
  gold: {
    buy: 10,
    sell: 5
  },
  stats: {
    stamina: {
      value: 20,
      name: 'STAM',
      hint: ''
    }
  }
}

export const ITEM_STAMINA_POTIONS: Item[] = [
  ITEM_POTION_STAMINA_WEAK,
]
