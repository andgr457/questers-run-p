import { INVENTORY_IDS } from '../../inventory/data/InventoryEntity.data'
import { ITEM_IDS } from '../../item/data/ItemEntity.data'

import type { CharacterInventoryEntity } from '../types/CharacterInventoryEntity.types'
import type { InventoryItemEntity } from '../../inventory-item/types/InventoryItemEntity.types'

export function createStarterInventory(
  characterId: string
): {
  characterInventory: CharacterInventoryEntity
  inventoryItems: InventoryItemEntity[]
} {

  const characterInventoryId =
    `${characterId}_${INVENTORY_IDS.STARTER_BAG}`

  const characterInventory: CharacterInventoryEntity = {
    id: characterInventoryId,
    characterId,
    inventoryId: INVENTORY_IDS.STARTER_BAG
  }

  const inventoryItems: InventoryItemEntity[] = [
    {
      characterInventoryId,
      itemId: ITEM_IDS.WEAK_HEALTH_POTION,
      amount: 2
    },
    {
      characterInventoryId,
      itemId: ITEM_IDS.WEAK_MANA_POTION,
      amount: 2
    },
    {
      characterInventoryId,
      itemId: ITEM_IDS.WEAK_STAMINA_POTION,
      amount: 2
    }
  ]

  return {
    characterInventory,
    inventoryItems
  }
}