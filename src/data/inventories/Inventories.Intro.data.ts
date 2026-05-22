import { DateTime } from 'luxon'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { ITEM_CURRENCY_GOLD } from '../items/currency/Item.Currency.data'
import { HEALTH_POTION_IDS } from '../items/potions/Item.Potions.Health.data'
import { MANA_POTION_IDS } from '../items/potions/Item.Potions.Mana.data'
import { STAMINA_POTION_IDS } from '../items/potions/Item.Potions.Stamina.data'

export const INVENTORY_INTRO_IDS = {
  CURRENCY_ID: 'inv_currency',
  BACKPACK_ID: 'inv_backpack'
} 

export const INVENTORY_INTRO_CURRENCY_DEFAULT: Inventory = {
  id: INVENTORY_INTRO_IDS.CURRENCY_ID,
  title: 'Currency',
  description: 'Stores tradable currencies.',
  characterId: '',
  max: null,
  restrictions: ['currency'],
  transactions: []
}

export function getInventoryIntroCurrencyPouch(characterId: string, uniqueId: string): Inventory {
  return {
    ...INVENTORY_INTRO_CURRENCY_DEFAULT,
    characterId,
    id: `${INVENTORY_INTRO_IDS.CURRENCY_ID}__${characterId}__${uniqueId}`,
    transactions: [{
      id: `invtxn__gold_add__intro__${characterId}__${uniqueId}`,
      date: DateTime.utc().toISO(),
      itemId: ITEM_CURRENCY_GOLD.id,
      quantity: 20
    }]
  }
}

export const INVENTORY_INTRO_STARTER_POUCH_DEFAULT: Inventory = {
  id: INVENTORY_INTRO_IDS.BACKPACK_ID,
  title: 'Backpack',
  description: 'Stores a decent amount of items.',
  characterId: '',
  max: 32,
  restrictions: ['general'],
  transactions: []
}

export function getInventoryIntroStarterPouch(characterId: string, uniqueId: string): Inventory {
  return {
    ...INVENTORY_INTRO_STARTER_POUCH_DEFAULT,
    characterId,
    id: `${INVENTORY_INTRO_IDS.BACKPACK_ID}__${characterId}__${uniqueId}`,
    transactions: [
      {
        id: `invtxn__healthpotion_add__intro__${characterId}__${uniqueId}`,
        date: DateTime.utc().toISO(),
        itemId: HEALTH_POTION_IDS.WEAK,
        quantity: 5
      },
      {
        id: `invtxn__manapotion_add__intro__${characterId}__${uniqueId}`,
        date: DateTime.utc().toISO(),
        itemId: MANA_POTION_IDS.WEAK,
        quantity: 5
      },
      {
        id: `invtxn__staminapotion_add__intro__${characterId}__${uniqueId}`,
        date: DateTime.utc().toISO(),
        itemId: STAMINA_POTION_IDS.WEAK,
        quantity: 5
      },
    ]
  }
}