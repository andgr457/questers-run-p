import type { QuestWithQuestProgressItem } from '../../components/quests/CharacterQuests'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { Mob, MobProgress } from '../../interfaces/mobs/Mob.types'
import type { QuestCompletionRequirement } from '../../interfaces/quests/Quests.types'
import { getQuestItemRequirement, getQuestMobRequirement, getQuestTimeRequirement } from './questCompletionRequirements.utils'

export function getQuestCompletionRequirement(
  requirement: QuestCompletionRequirement,
  questWithProgress: QuestWithQuestProgressItem,
  items: Item[],
  characterInventories: Inventory[],
  mobs: Mob[],
  mobProgress: MobProgress[]
): QuestCompletionRequirement {

  if (requirement.timeMinutes) {
    return getQuestTimeRequirement(
      requirement,
      questWithProgress.questProgress?.startDate
    )
  }

  if (requirement.itemId) {
    return getQuestItemRequirement(
      requirement,
      items,
      characterInventories
    )
  }

  if (requirement.mobId) {
    return getQuestMobRequirement(
      requirement,
      mobs,
      mobProgress,
      questWithProgress.questProgress?.id
    )
  }

  return {
    ...requirement,
    completed: false,
  }
}