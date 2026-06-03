import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Mob } from '../../../interfaces/mobs/Mob.types'
import type { Quest } from '../../../interfaces/quests/Quests.types'

export interface QuestRequirementObjectsForUI {
  questAchievements: Achievement[]
  questMobs: Mob[]
  questItems: Item[]
  questQuests: Quest[]
}

export function getQuestRequirementObjectsForUI(
  quest: Quest,
  allAchievements: Achievement[],
  allMobs: Mob[],
  allItems: Item[],
  allQuests: Quest[]
): QuestRequirementObjectsForUI {
  const questAchievements: Achievement[] = []
  const questMobs: Mob[] = []
  const questItems: Item[] = []
  const questQuests: Quest[] =[]
  quest.startRequirements.forEach(req => {
    if(req.achievementId){
      const found = allAchievements.find(a => a.id === req.achievementId)
      if(found){
        questAchievements.push(found)
      }
    }
    if(req.itemId){
      const found = allItems.find(i => i.id === req.itemId)
      if(found){
        questItems.push(found)
      }
    }
    if(req.questId){
      const found = allQuests.find(q => q.id === req.questId)
      if(found){
        questQuests.push(found)
      }
    }
  })

  quest.completionRequirements.forEach(req => {
    if(req.achievementId){
      const found = allAchievements.find(a => a.id === req.achievementId)
      if(found){
        questAchievements.push(found)
      }
    }
    if(req.itemId){
      const found = allItems.find(i => i.id === req.itemId)
      if(found){
        questItems.push(found)
      }
    }
    if(req.mobId){
      const found = allMobs.find(m => m.id === req.mobId)
      if(found){
        questMobs.push(found)
      }
    }
  })
  return {
    questAchievements,
    questItems,
    questMobs,
    questQuests
  }
}