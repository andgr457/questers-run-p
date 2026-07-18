import { GAME_ITEMS } from '../../item/data/Item.data'
import type { QuestRequirementComplete } from '../types/QuestRequirement.type'

export function getQuestCompleteGatherItemQty(itemId: string, amount: number): QuestRequirementComplete {
  const item = GAME_ITEMS.find(i => i.id === itemId)
  return {
    title: `Gather ${item?.name}`,
    itemId,
    itemName: item?.name,
    itemAmount: amount
  }
}
