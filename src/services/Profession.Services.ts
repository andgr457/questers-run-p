import { DateTime } from 'luxon'
import type { Character, Stat } from '../interfaces/characters/Character.types'
import type { Inventory } from '../interfaces/inventories/Inventory.types'
import type { Item } from '../interfaces/items/Item.types'
import { characterServiceModifyProfessionStat } from './Character.Service'

export function professionServiceItemComplete(
  characterInventories: Inventory[],
  character: Character,
  professionItem: Item,
  amount: number
): {inventoryRef: Inventory | null, professionStat: Stat | null, staminaStat: Stat | null} {
  if(!characterInventories || characterInventories.length === 0 ||
    !character || !professionItem || typeof amount !== 'number'
  ){
    return {inventoryRef: null, professionStat: null, staminaStat: null}
  }

  if(!professionItem.profession?.type){
    return {inventoryRef: null, professionStat: null, staminaStat: null}
  }

  let invRef = undefined
  for(const inv of characterInventories){
    const invTxns = inv.transactions.filter(t => t.itemId === professionItem.id)
    
    if(invTxns.length > 0){
      invRef = inv
      break
    }
  }
  if(!invRef){
    invRef = characterInventories?.find(i => i.title === 'Backpack')
  }
  if(!invRef){
    return {inventoryRef: null, professionStat: null, staminaStat: null}
  }

  invRef.transactions.push({
    id: `invtxn__${professionItem.id}__${character?.id}__${DateTime.utc().toMillis()}`,
    date: DateTime.utc().toISO(),
    itemId: professionItem.id,
    note: `Profession Item Transaction`,
    quantity: amount
  })

  const newStats = characterServiceModifyProfessionStat(
    character,
    professionItem.profession.type,
    amount,
    professionItem
  )
  if(!newStats || !newStats.staminaStat || !newStats.professionStat){
    return {inventoryRef: null, professionStat: null, staminaStat: null}
  }

  return {inventoryRef: invRef, professionStat: newStats.professionStat, staminaStat: newStats.staminaStat}
}