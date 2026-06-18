import type { CharacterInventoryEntity } from '../../types/CharacterInventoryEntity.types'
import type { InventoryEntity } from '../../../inventory/types/InventoryEntity.types'

import styles from './CharacterInventoryListRecord.module.css'

type Props = {
  characterInventory: CharacterInventoryEntity
  inventory: InventoryEntity
  usedSlots: number

  onClick: () => void
}

export default function CharacterInventoryListRecord({
  inventory,
  usedSlots,
  onClick
}: Props) {

  return (
    <button className={styles.record} onClick={onClick}>
      <div className={styles.title}>
        {inventory.title}
      </div>

      <div className={styles.slots}>
        Slots: {usedSlots} / {inventory.slotCount}
      </div>
    </button>
  )
}