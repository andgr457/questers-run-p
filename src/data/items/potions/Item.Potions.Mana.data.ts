import { ITEM_RARITY, ITEM_TYPES, type Item } from '../../../interfaces/items/Item.types'

export const MANA_POTION_IDS = {
  WEAK: 'i_manapotion_1',
  COMMON: 'i_manapotion_2',
  STRONG: 'i_manapotion_3',
  GRAND: 'i_manapotion_4',
  EPIC: 'i_manapotion_5' 
}

export const ITEM_POTION_MANA_WEAK: Item = {
  id: MANA_POTION_IDS.WEAK,
  name: 'Weak Mana Potion',
  description: 'Restores a small amount of MP on use.',
  type: ITEM_TYPES.CONSUMABLE,
  rarity: ITEM_RARITY.COMMON,
  stats: {
    mp: 20
  }
}

export const ITEM_MANA_POTIONS: Item[] = [
  ITEM_POTION_MANA_WEAK,
]
