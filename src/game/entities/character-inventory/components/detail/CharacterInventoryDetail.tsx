import type { CharacterInventoryEntity } from '../../types/CharacterInventoryEntity.types'
import type { InventoryItemEntity } from '../../../inventory-item/types/InventoryItemEntity.types'
import type { InventoryEntity } from '../../../inventory/types/InventoryEntity.types'


import styles from './CharacterInventoryDetail.module.css'
import { GAME_INVENTORIES } from '../../../inventory/data/InventoryEntity.data'
import { GAME_ITEMS } from '../../../item/data/ItemEntity.data'

type Props = {
  characterInventory: CharacterInventoryEntity

  inventoryItems: InventoryItemEntity[]

  onSelectItem: (itemId: string) => void
}

export default function CharacterInventoryDetail({
  characterInventory,
  inventoryItems,
  onSelectItem
}: Props) {

  const itemsInBag = inventoryItems.filter(
    i => i.characterInventoryId === characterInventory.id
  )
  const inventory = GAME_INVENTORIES.find(i => i.id === characterInventory.inventoryId) as InventoryEntity

  const getItem = (itemId: string) =>
    GAME_ITEMS.find(i => i.id === itemId)

  const slotsUsed = itemsInBag.length
  const emptySlots = inventory.slotCount - slotsUsed

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div>{inventory.title}</div>
        <div className={styles.slots}>
          {slotsUsed} / {inventory.slotCount}
        </div>
      </div>

      <div className={styles.grid}>

        {/* REAL ITEMS */}
        {itemsInBag.map((invItem, index) => {
          const item = getItem(invItem.itemId)
          if (!item) return null

          return (
            <button
              key={`${invItem.itemId}_${index}`}
              className={styles.slot}
              onClick={() => onSelectItem(invItem.itemId)}
            >
              <div className={styles.itemName}>
                {item.titleString}
              </div>

              <div className={styles.amount}>
                x{invItem.amount}
              </div>
            </button>
          )
        })}

        {/* EMPTY SLOTS */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty_${i}`} className={styles.emptySlot} />
        ))}

      </div>
    </div>
  )
}