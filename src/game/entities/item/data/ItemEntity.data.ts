import type { ItemEntity } from '../types/ItemEntity.types'

export const ITEM_IDS = {
  WEAK_HEALTH_POTION: 'weak_health_potion',
  WEAK_MANA_POTION: 'weak_mana_potion',
  WEAK_STAMINA_POTION: 'weak_stamina_potion'
} as const

export const GAME_ITEMS: ItemEntity[] = [
  {
    id: ITEM_IDS.WEAK_HEALTH_POTION,
    title: 'Weak Health Potion',
    titleString: 'Weak Health Potion',
    description: 'Restores a small amount of health.',
    gold: {
      buy: 10,
      sell: 5
    },
    type: 'consumable',
    stackable: true
  },

  {
    id: ITEM_IDS.WEAK_MANA_POTION,
    title: 'Weak Mana Potion',
    titleString: 'Weak Mana Potion',
    description: 'Restores a small amount of mana.',
    gold: {
      buy: 10,
      sell: 5
    },
    type: 'consumable',
    stackable: true
  },

  {
    id: ITEM_IDS.WEAK_STAMINA_POTION,
    title: 'Weak Stamina Potion',
    titleString: 'Weak Stamina Potion',
    description: 'Restores a small amount of stamina.',
    gold: {
      buy: 10,
      sell: 5
    },
    type: 'consumable',
    stackable: true
  }
]