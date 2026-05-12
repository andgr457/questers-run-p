import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Stat } from '../../interfaces/characters/Character.types'
import type { Item } from '../../interfaces/items/Item.types'

interface ProfessionItemProps extends AppProperties {
  professionItem: Item
  canDo: boolean
  handleDoProfessionItem: (itemId: string, amount: number, timeSeconds: number) => Promise<void>
}

export default function ProfessionItem(props: ProfessionItemProps){
  const {
    professionItem,
    character,
    characterInventories,
    canDo,
    handleDoProfessionItem
  } = props

  let characterAmount = 0
  for(const inv of characterInventories ?? []){
    const invTxns = inv.transactions.filter(t => t.itemId === professionItem.id)
    for(const txn of invTxns){
      characterAmount += txn.quantity
    }
  }
  
  let getAmount = 1
  //@ts-ignore
  const professionStat: Stat = character?.professions[professionItem.type]
  if(professionStat){
    console.log(professionStat)
  }
  const clickFn = canDo === true ? async () => {
    await handleDoProfessionItem(professionItem.id, getAmount, 10)
  } : () => {}

  return <div className='profession-item' onClick={clickFn}>
    <div className='profession-item-title'>
      {professionItem.name}
    </div>
    <div className='profession-item-description'>
      {professionItem.description}
    </div>
    <div className='profession-item-info'>
      {characterAmount} in inventory.
    </div>
  </div>
}