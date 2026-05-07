import { DateTime } from 'luxon'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { ITEM_CURRENCY_GOLD } from '../items/currency/Item.Currency.data'
import { HEALTH_POTION_IDS } from '../items/potions/Item.Potions.Health.data'

export const INVENTORY_INTRO_IDS = {
  CURRENCY_ID: 'inv_currency',
  NAPSACK_ID: 'inv_napsack'
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
      note: 'Found some coins lying around.',
      quantity: 20
    }]
  }
}

export const INVENTORY_INTRO_STARTER_POUCH_DEFAULT: Inventory = {
  id: INVENTORY_INTRO_IDS.NAPSACK_ID,
  title: 'Napsack',
  description: 'Stores a small amount of items.',
  characterId: '',
  max: 8,
  restrictions: ['general'],
  transactions: []
}

export function getInventoryIntroStarterPouch(characterId: string, uniqueId: string): Inventory {
  return {
    ...INVENTORY_INTRO_STARTER_POUCH_DEFAULT,
    characterId,
    id: `${INVENTORY_INTRO_IDS.NAPSACK_ID}__${characterId}__${uniqueId}`,
    transactions: [{
      id: `invtxn__healthpotion_add__intro__${characterId}__${uniqueId}`,
      date: DateTime.utc().toISO(),
      itemId: HEALTH_POTION_IDS.WEAK,
      note: 'Gifted potions from the adventurers guild.',
      quantity: 5
    }]
  }
}