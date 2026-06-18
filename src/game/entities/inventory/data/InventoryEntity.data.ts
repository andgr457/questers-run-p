import type { InventoryEntity } from '../types/InventoryEntity.types'

export const INVENTORY_IDS = {
  STARTER_BAG: 'starter_bag'
} as const

export const GAME_INVENTORIES: InventoryEntity[] = [
  {
    id: INVENTORY_IDS.STARTER_BAG,
    title: 'Starter Bag',
    slotCount: 20
  }
]