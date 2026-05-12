import type { ProfessionType } from '../../data/items/professions/Profession.Gathering.data'
import type { Stats } from '../characters/Character.types'

export const ITEM_TYPES = {
  RESOURCE: 'resource' as ItemType,
  WEAPONS: 'weapon' as ItemType,
  ARMOR: 'armor' as ItemType,
  CURRENCY: 'currency' as ItemType,
  CONSUMABLE: 'consumable' as ItemType
}

export const ITEM_RARITY = {
  COMMON: 'common' as ItemRarity,
  UNCOMMON: 'uncommon' as ItemRarity,
  RARE: 'rare' as ItemRarity,
  LEGENDARY: 'legendary' as ItemRarity,
  EPIC: 'epic' as ItemRarity,
  UNIQUE: 'unique' as ItemRarity,
}

export type ItemType = 
  'resource' 
  | 'weapon' 
  | 'arrows'
  | 'bolts'
  | 'armor' 
  | 'currency' 
  | 'consumables'
  //Everything except currencies
  | 'general'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'epic' | 'unique'
export interface ItemGold {
  sell: number
  buy: number
}
export interface Item {
  id: string
  name: string
  description: string
  rarity: ItemRarity
  type: ItemType
  stats: Stats
  gold: ItemGold,
  profession?: ProfessionType
}