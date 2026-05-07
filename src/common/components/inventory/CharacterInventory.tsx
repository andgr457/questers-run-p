import { ITEM_CURRENCY_IDS } from '../../../data/items/currency/Item.Currency.data'
import type { Character } from '../../../interfaces/characters/Character.types'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import type { Item } from '../../../interfaces/items/Item.types'
import CustomContainer from '../CustomContainer'
import InventorySlot, { type InventorySlotProps } from './InventorySlot'
import './Inventory.css'

interface CharacterInventoryProps {
  inventories: Inventory[]
  character: Character
  items: Item[]
}
export default function CharacterInventory(props: CharacterInventoryProps){
  const {
    inventories,
    character,
    items
  } = props

  const relatedInventories = inventories?.filter(inv => inv.characterId === character.id)

  const currencyPouch = relatedInventories?.find(i => i.title === 'Currency')
  let totalGold = 0
  currencyPouch?.transactions?.map(txn => {
    if(txn.itemId === ITEM_CURRENCY_IDS.GOLD){
      totalGold += txn.quantity
    }
  })

  const currencyHeaderLeft = `Gold ${totalGold.toLocaleString()}`

  return <div id='tutorial-inventory'>
    <CustomContainer 
      title='Inventory'
      expandable={true}
      isChildCustomContainer={false}
    >
      {relatedInventories.map(inv => {
        const mappedItems: InventorySlotProps[] = []
        for(const txn of inv.transactions){
          const found = mappedItems.find(iui => iui.itemId === txn.itemId)
          if(!found){
            const item = items.find(i => i.id === txn.itemId)
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
        return <CustomContainer
          title={inv.title}
          description={inv.description}
          expandable={true}
          isChildCustomContainer={true}
          headerLeft={inv.title === 'Currency' ? currencyHeaderLeft : bagHeaderLeft}
        >
          <div className='inventory-slots'>
            {mappedItems.map(mi => {
              return <InventorySlot character={character}
                item={items.find(i => i.id === mi.itemId)} 
                amount={mi.amount}
              />
            })}
            {emptySlots}
          </div>
        </CustomContainer>
      })}
    </CustomContainer>
  </div>
}