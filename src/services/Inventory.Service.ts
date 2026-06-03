import { DateTime } from 'luxon';
import { ITEM_CURRENCY_IDS } from '../data/items/currency/Item.Currency.data';
import type { InventoryTransaction } from '../interfaces/inventories/Inventory.types';
import type { QuestCompletionRequirement, QuestRewardUI } from '../interfaces/quests/Quests.types';

function getTransactionId(itemId: string, charId: string): string {
  return `invtxn_${itemId}_${charId}_${DateTime.utc().toMillis()}`
}

export function inventoryServiceGetQuestCompletionTransactions(
  characterId: string,
  requirements: QuestCompletionRequirement[]
): InventoryTransaction[] {
  if (!requirements || requirements.length === 0) return []

  return requirements.flatMap(r => {
    if (!r.itemId || !r.itemAmount) return []

    return [{
      id: getTransactionId(r.itemId, characterId),
      date: DateTime.utc().toISO(),
      itemId: r.itemId,
      //comes in as a positive value
      quantity: r.itemAmount * -1
    }]
  })
}

export function inventoryServiceHandleQuestRewardTransactions(
  characterId: string,
  rewards: QuestRewardUI[],
  backpackType: 'Currency' | 'Backpack'
): InventoryTransaction[] {
  if(!characterId){
    return []
  }
  if(!rewards || rewards.length === 0) return []

  const dateNow = DateTime.utc().toISO()
  if(backpackType === 'Currency'){
    const currencyTxns: InventoryTransaction[] = []
    rewards.forEach(r => {
      if(r.itemId && r.itemId === ITEM_CURRENCY_IDS.GOLD && r.itemAmount){
        currencyTxns.push({
          id: getTransactionId(r.itemId, characterId),
          date: dateNow,
          itemId: r.itemId,
          quantity: r.itemAmount
        })
      }
    })
    return currencyTxns
  } else {
    const backpackTxns: InventoryTransaction[] = []
    rewards.forEach(r => {
      if(r.itemId && r.itemId !== ITEM_CURRENCY_IDS.GOLD && r.itemAmount){
        backpackTxns.push({
          id: getTransactionId(r.itemId, characterId),
          date: dateNow,
          itemId: r.itemId,
          quantity: r.itemAmount
        })
      }
    })
  }

  return []
}