import type { CharacterInventoryEntity } from '../../types/CharacterInventoryEntity.types'
import type { InventoryItemEntity } from '../../../inventory-item/types/InventoryItemEntity.types'

import styles from './CharacterInventoryList.module.css'
import CharacterInventoryListRecord from './CharacterInventoryListRecord'
import { GAME_INVENTORIES } from '../../../inventory/data/InventoryEntity.data'

type Props = {
  characterInventories: CharacterInventoryEntity[]
  inventoryItems: InventoryItemEntity[]

  onSelectInventory: (characterInventoryId: string) => void
}

export default function CharacterInventoryList({
  characterInventories,
  inventoryItems,
  onSelectInventory
}: Props) {

  const getInventory = (inventoryId: string) =>
    GAME_INVENTORIES.find(i => i.id === inventoryId)

  const getUsedSlots = (characterInventoryId: string) =>
    inventoryItems
      .filter(i => i.characterInventoryId === characterInventoryId)
      .length

  return (
    <div className={styles.container}>
      {characterInventories.map(ci => {
        const inventory = getInventory(ci.inventoryId)
        if (!inventory) return null

        const usedSlots = getUsedSlots(ci.id)

        return (
          <CharacterInventoryListRecord
            key={ci.id}
            characterInventory={ci}
            inventory={inventory}
            usedSlots={usedSlots}
            onClick={() => onSelectInventory(ci.id)}
          />
        )
      })}
    </div>
  )
}