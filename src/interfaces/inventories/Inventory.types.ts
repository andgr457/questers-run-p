import type { ItemType } from '../items/Item.types'

export interface Inventory {
  id: string
  characterId: string
  title: string
  description: string
  //unrestricted max for restrictions like currency item types
  max: number | null
  restrictions: ItemType[]
  transactions: InventoryTransaction[]
}

export interface InventoryTransaction {
  id: string
  itemId: string
  quantity: number
  note: string
  date: string
}