import { type Item } from '../../interfaces/items/Item.types'
import { itemServiceGetItemTypeIcon } from '../../services/Item.Service'

export interface InventorySlotProps {
  itemInfo: Item
  amount: number
  onConsume?: () => void
  onItemClick?: () => void
}

export default function InventorySlot(props: InventorySlotProps){
  const {
    itemInfo,
    amount,
    onItemClick,
  } = props

  const buildItemDescription = (item?: Item) => {
    if (!item) return 'Empty Slot'

    const lines: string[] = []

    // Header
    lines.push(`${item.name}`)
    lines.push(`${item.rarity.toUpperCase()} ${item.type.toUpperCase()}`)
    lines.push('')

    // Description
    if (item.description) {
      lines.push(item.description)
      lines.push('')
    }

    // Stats
    const statEntries = Object.entries(item?.stats ?? {})
      .filter(([_, value]) => value?.value)

    if (statEntries.length > 0) {
      lines.push('=== STATS ===')

      statEntries.forEach(([key, value]) => {
        const maxText = value?.max
          ? ` / ${value.max}`
          : ''

        lines.push(
          `${key.toUpperCase()}: +${value?.value}${maxText}`
        )
      })

      lines.push('')
    }

    // Gold
    if (item.gold) {
      lines.push('=== VALUE ===')
      lines.push(`BUY: ${item.gold.buy} Gold`)
      lines.push(`SELL: ${item.gold.sell} Gold`)
      lines.push('')
    }

    // Profession
    if (item.profession) {
      lines.push('=== PROFESSION ===')
      lines.push(`TYPE: ${item.profession.type}`)
      lines.push(`LEVEL REQUIRED: ${item.profession.levelRequired}`)
      lines.push(`XP GAIN: ${item.profession.xp}`)
      lines.push(`STAMINA COST: ${item.profession.stamina}`)
      lines.push(`TIME: ${item.profession.timeInSeconds}s`)

      if (item.profession.recipeId) {
        lines.push(`RECIPE: ${item.profession.recipeId}`)
      }

      lines.push('')
    }

    return lines.join('\n')
  }

  return (
    <div
      onClick={onItemClick}
      title={itemInfo?.description && buildItemDescription(itemInfo)}
      className={`
        inventory-slot
        ${!itemInfo?.type ? 'empty' : ''}
        ${itemInfo?.rarity ? `rarity-${itemInfo.rarity.toLowerCase()}` : ''}
        ${itemInfo?.type ? `type-${itemInfo.type.toLowerCase()}` : ''}
      `}
    >
      {!!amount && amount >= 1 && (
        <div className='inventory-slot-quantity'>
          {amount}
        </div>
      )}

      <div className='inventory-slot-top'>
        <div className='inventory-slot-type'>
          {itemInfo?.type?.slice(0, 4)}
        </div>
      </div>

      <div className='inventory-slot-center'>
        <div className='inventory-slot-icon'>
          {itemServiceGetItemTypeIcon(itemInfo?.type)}
        </div>
      </div>

      <div className='inventory-slot-bottom'>
        <div className='inventory-slot-title'>
          {itemInfo?.name}
        </div>

        {!!itemInfo?.stats && (
          <div className='inventory-slot-stats'>
            {Object.entries(itemInfo.stats).map(([key, value]) => {
              if (!value?.value) return null

              return (
                <div
                  key={key}
                  className='inventory-slot-stat'
                >
                  +{value.value} {key}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}