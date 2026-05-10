import { useCallback, useState } from 'react'
import { ITEM_TYPES, type Item } from '../../interfaces/items/Item.types'
import { useConfirm } from '../../providers/ConfirmProvider'
import type { Character } from '../../interfaces/characters/Character.types'

export interface InventorySlotProps {
  character?: Character
  item?: Item
  itemId?: string
  itemName?: string
  amount?: number
  onConsume?: () => void
}

export default function InventorySlot(props: InventorySlotProps){
  const {
    item,
    itemId,
    itemName,
    amount,
    character
  } = props

  const {showConfirm} = useConfirm()

  const onClick = useCallback(() => {
    if(!item) return

    if(item?.type === ITEM_TYPES.ARMOR || item?.type === ITEM_TYPES.WEAPONS){
      
    } else if(item?.type === ITEM_TYPES.CONSUMABLE){
      const itemHp = item?.stats?.hp?.value
      if(itemHp && itemHp > 0){
        //health pot
        if(character){
          if(character.stats.hp?.value === character.stats.hp?.max){
            if(!showConfirm({
              isYesNo: true,
              title: `Warning! Health Already Max`,
              message: `Your health is already at the max. Are you sure you want to waste the ${item.name}?`
            })) return

            //otherwise consume
          }
        }
      }
    }
    

  }, [item])

  let itemDescription = `${item?.description}\r\n`
  itemDescription += `${item?.rarity} ${item?.type}`.toUpperCase()


  return <div onClick={onClick} title={itemDescription} className={`inventory-slot ${!item?.type && 'empty'}`}>
    <div className='inventory-slot-quantity'>
      {amount}
    </div>
    <div className='inventory-slot-title'>
      {item?.name}
    </div>
  </div>
}