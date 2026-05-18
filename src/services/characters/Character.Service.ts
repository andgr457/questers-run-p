import type { Inventory } from '../../interfaces/inventories/Inventory.types';

export function getCharacterItemAmount(characterInventories: Inventory[], itemId: string){
  if(!characterInventories || characterInventories.length === 0) return 0
  
  let amount = 0
  characterInventories.forEach(i => {
    const itemTransactions = i.transactions.filter(t => t.itemId === itemId)
    itemTransactions.forEach(t => {
      amount += t.quantity
    })
  })
  return amount
}