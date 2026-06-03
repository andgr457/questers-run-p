import type { Inventory } from '../../interfaces/inventories/Inventory.types';

export function getCharacterItemAmount(
  characterInventories: Inventory[],
  itemId: string
): number | null {
  if(!characterInventories || characterInventories.length === 0) return null
  if(!itemId) return null
  let quantity = 0
  for(const i of characterInventories){
    for(const txn of i.transactions ?? []){
      if(txn.itemId === itemId){
        quantity += txn.quantity
      }
    }
  }
  return quantity
}