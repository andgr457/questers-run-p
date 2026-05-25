import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import InventorySlot from './InventorySlot'
import './Inventory.css'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Item } from '../../interfaces/items/Item.types'
import ItemInfo from '../items/ItemInfo'

interface CharacterInventoryProps extends AppProperties {}

export default function CharacterInventory(props: CharacterInventoryProps) {
  const {
    character,
    characterInventories,
    items,
    toggleWindow
  } = props

  const itemMap = new Map(items?.map(i => [i.id, i]) ?? [])

  const currencyPouch = characterInventories?.find(i => i.title === 'Currency')

  let totalGold = 0
  for (const txn of currencyPouch?.transactions ?? []) {
    if (txn.itemId === ITEM_CURRENCY_IDS.GOLD) {
      totalGold += txn.quantity
    }
  }

  if (!character?.name || !currencyPouch) return null

  return (
    <div>
      {/* HEADER */}
      <div className='character-section-title'>
        <div className='page-header-banner'>
          <div className='page-header-title'>
            INVENTORY
          </div>
        </div>
      </div>

      {characterInventories?.map(inv => {
        const mappedItems: {
          item: Item
          amount: number
          
        }[] = []
        for (const txn of inv.transactions ?? []) {
          const item = itemMap.get(txn.itemId)
          if (!item) continue

          const existing = mappedItems.find(i => i.item?.id === txn.itemId)

          if (!existing) {
            mappedItems.push({
              item,
              amount: txn.quantity,
              
            })
          } else {
            if(typeof existing.amount === 'number'){
              existing.amount += txn.quantity
            }
          }
        }

        const maxSlots = inv.max ?? 0
        const usedSlots = mappedItems.length
        const emptySlotAmount = Math.max(0, maxSlots - usedSlots)

        return (
          <div
            className='inventory-section'
            id={`${character.id}__${inv.id}`}
            key={inv.id}
          >
            {/* SECTION TITLE */}
            <div className='character-section-title'>
              <div className='page-header-banner'>
                <div className='page-header-title'>
                  {inv.title}
                </div>
              </div>
            </div>

            {/* SLOTS */}
            <div className='inventory-slots'>
              {mappedItems
                .filter((mi): mi is { item: Item; amount: number } =>
                  !!mi.item && typeof mi.amount === 'number' && mi.amount > 0
                )
                .sort((a, b) =>
                  (a.item.type ?? '').localeCompare(b.item.type ?? '')
                )
                .map(mi => (
                  <InventorySlot
                    key={`${inv.id}-${mi.item.id}`}
                    itemInfo={mi.item}
                    amount={mi.amount}
                    onItemClick={() => {
                        toggleWindow?.(
                          `item-${mi.item.id}`,
                          mi.item.name,
                          ItemInfo,
                          { item: mi.item, amount: mi.amount }
                        )
                      
                    }}
                  />
                ))}

              {/* EMPTY SLOTS (safe placeholders, NOT InventorySlot) */}
              {Array.from({ length: emptySlotAmount }).map((_, i) => (
                <div
                  key={`empty-${inv.id}-${i}`}
                  className='inventory-slot empty'
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}