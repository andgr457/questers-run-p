import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import CustomContainer from '../CustomContainer'
import InventorySlot, { type InventorySlotProps } from './InventorySlot'
import './Inventory.css'
import type { AppProperties } from '../../interfaces/AppProperties.types'

interface CharacterInventoryProps extends AppProperties {

}
export default function CharacterInventory(props: CharacterInventoryProps){
  const {
    character,
    characterInventories,
    items,
  } = props

  const currencyPouch = characterInventories?.find(i => i.title === 'Currency')
  let totalGold = 0
  currencyPouch?.transactions?.map(txn => {
    if(txn.itemId === ITEM_CURRENCY_IDS.GOLD){
      totalGold += txn.quantity
    }
  })

  const currencyHeaderLeft = `Gold ${totalGold.toLocaleString()}`
  
  if(!character?.name || !currencyPouch) return null

  return <div>
    {characterInventories?.map(inv => {
      const mappedItems: InventorySlotProps[] = []
      for(const txn of inv.transactions){
        const found = mappedItems.find(iui => iui.itemId === txn.itemId)
        if(!found){
          const item = items?.find(i => i.id === txn.itemId)
          mappedItems.push({itemId: txn.itemId, itemName: item?.name as string, amount: txn.quantity})
        } else {
          //@ts-ignore
          found.amount += txn.quantity
        }
      }
      //@ts-ignore
      const bagFull = inv.title !== 'Currency' && mappedItems.length >= inv.max
      const bagHeaderLeft = `${mappedItems.length}/${inv.max} Slots`

      //@ts-ignore
      const emptySlotAmount = inv.max - mappedItems.length
      const emptySlots = []
      for(let i = 0; i < emptySlotAmount; i++){
        emptySlots.push(<InventorySlot character={character} />)
      }
      return <div id={`${character?.id}__${inv.id}`}><CustomContainer
        title={inv.title}
        description={inv.description}
        expandable={true}
        expanded={true}
        isChildCustomContainer={true}
        headerLeft={inv.title === 'Currency' ? currencyHeaderLeft : bagHeaderLeft}
      >
        <div className='inventory-slots'>
          {mappedItems.map(mi => {
            return <InventorySlot character={character}
              item={items?.find(i => i.id === mi.itemId)} 
              amount={mi.amount}
            />
          })}
          {emptySlots}
        </div>
      </CustomContainer></div>
    })}
  </div>
}