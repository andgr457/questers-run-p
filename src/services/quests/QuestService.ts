import { DateTime } from 'luxon';
import type { QuestWithQuestProgress } from '../../components/quests/CharacterQuests';
import type { Achievement } from '../../interfaces/achievements/Achievement.types';
import { GuildRankLevelByRank, type Character } from '../../interfaces/characters/Character.types';
import type { Inventory, InventoryTransaction } from '../../interfaces/inventories/Inventory.types';
import type { Item } from '../../interfaces/items/Item.types';
import type { Quest, QuestGroup, QuestProgress } from '../../interfaces/quests/Quests.types';
import type { Mob, MobProgress } from '../../interfaces/mobs/Mob.types';

export class QuestService {

  async getQuestsWithQuestProgress(
    character: Character, 
    quests: Quest[], 
    questGroups: QuestGroup[], 
    characterQuestProgress: QuestProgress[],
    characterInventories: Inventory[],
    achievements: Achievement[],
    items: Item[],
    mobs: Mob[],
    mobProgress: MobProgress[]
  ): Promise<QuestWithQuestProgress[]> {
    let anyQuestInProgress = false
    
    const questsWithProgress: QuestWithQuestProgress[] = []
    for(const q of quests){
      const progress = characterQuestProgress?.find(qp => qp.questId === q.id && qp.characterId === character.id)
      if(progress && progress.status === 'in-progress'){
        anyQuestInProgress = true  
      }

      let canComplete = true
      
      const relatedAchievements: Achievement[] = []
      const relatedMobs: Mob[] = []
      const relatedItems: Item[] = []
      const relatedQuests: Quest[] = []
      const relatedTxns: InventoryTransaction[] = []
      for(const req of q.startRequirements){
        req.completed = false
        if(typeof req.guildRankLevel === 'number'){
          const characterRankLevel = GuildRankLevelByRank[character.guildRank]
          if(characterRankLevel >= req.guildRankLevel){
            req.completed = true
          }
        }
        if(req.itemId){
          if(!relatedItems.find(ri => ri.id === req.itemId)){
            const item = items.find(i => i.id === req.itemId)
            relatedItems.push(item as Item)
            for(const inventory of characterInventories){
              for(const txn of inventory.transactions){
                if(txn.itemId === req.itemId){
                  const exists = relatedTxns.find(rt => rt.id === txn.id)
                  if(!exists){
                    relatedTxns.push(txn)
                  }
                }
              }
            }
          }
        }
        if(req.achievementId){
          if(!relatedAchievements.find(ra => ra.id === req.achievementId)){
            const achievement = achievements.find(a => a.id === req.achievementId)
            relatedAchievements.push(achievement as Achievement)
          }
        }
        if(req.questId){
          if(!relatedQuests.find(rq => rq.id === req.questId)){
            const quest = quests.find(quest => quest.id === req.questId)
            relatedQuests.push(quest as Quest)
          }
        }
      }
      for(const req of q.completionRequirements){
        req.completed = false
        if(req.achievementId){
          if(!relatedAchievements.find(ra => ra.id === req.achievementId)){
            const achievement = achievements.find(a => a.id === req.achievementId)
            relatedAchievements.push(achievement as Achievement)
          }
        }
        if(req.mobId){
          if(!relatedMobs.find(rm => rm.id === req.mobId)){
            const mob = mobs.find(m => m.id === req.mobId)
            relatedMobs.push(mob as Mob)
          }
        }
        if(req.itemId){
          if(!relatedItems.find(ri => ri.id === req.itemId)){
            const item = items.find(i => i.id === req.itemId)
            relatedItems.push(item as Item)
            for(const inventory of characterInventories){
              for(const txn of inventory.transactions){
                if(txn.itemId === req.itemId){
                  const exists = relatedTxns.find(rt => rt.id === txn.id)
                  if(!exists){
                    relatedTxns.push(txn)
                  }
                }
              }
            }
          }
        }
        if(req.achievementId){
          if(!relatedAchievements.find(ra => ra.id === req.achievementId)){
            const achievement = achievements.find(a => a.id === req.achievementId)
            relatedAchievements.push(achievement as Achievement)
          }
        }
      }

      for(const req of q.completionRequirements){
        req.completed = false
        if(req.achievementId){
          if(character.achievements.find(a => a.achievementId === req.achievementId)){
            req.completed = true
          } else {
            canComplete = false
          }
          if(!relatedAchievements.find(ra => ra.id === req.achievementId)){
            const achievement = achievements.find(a => a.id === req.achievementId)
            relatedAchievements.push(achievement as Achievement)
          }
        }

        if(req.mobId && typeof req.mobAmount === 'number'){
          const characterQuestMobProgress = mobProgress.filter(mp => mp.characterId === character.id && mp.questProgressId === progress?.id && progress?.status === 'in-progress')
          const progressAmount = characterQuestMobProgress.length
          if(progressAmount >= req.mobAmount){
            req.completed = true
          } else {
            canComplete = false
          }
        }

        if(req.itemId && typeof req.itemAmount === 'number'){
          let relatedAmount = 0
          for(const inventory of characterInventories){
            const relatedTxns = inventory.transactions.filter(t => t.itemId === req.itemId)
            
            for(const txn of relatedTxns){
              relatedAmount += txn.quantity
            }

          }
          
          if(relatedAmount >= req.itemAmount){
            req.completed = true
          } else {
            canComplete = false
          }
        }

        if(req.timeMinutes){
          if(progress?.startDate && progress?.status === 'in-progress'){
            const startDate = DateTime.fromISO(progress.startDate as string)
            const minutesElapsed = Math.abs(startDate.diffNow('minutes').minutes)
            if(minutesElapsed >= req.timeMinutes){
              req.completed = true
            } else {
              canComplete = false
            }
          } else {
            canComplete = false
          }
        }
      }  
      
      const group = questGroups.find(qg => qg.id === q.groupId)
      
      let canTake = anyQuestInProgress === false
      for(const req of q.startRequirements){
        req.completed = false
        if(typeof req.guildRankLevel === 'number'){
          const characterRankLevel = GuildRankLevelByRank[character.guildRank]
          if(characterRankLevel >= req.guildRankLevel){
            req.completed = true
          }
        }
        if(req.achievementId){
          if(character.achievements.find(a => a.achievementId === req.achievementId)){
            req.completed = true
          } else {
            canTake = false
          }
        }
        if(req.itemId && req.itemAmount){
          for(const inventory of characterInventories){
            const relatedTxns = inventory.transactions.filter(t => t.itemId === req.itemId)

            let relatedAmount = 0
            for(const txn of relatedTxns){
              relatedAmount += txn.quantity
            }

            if(relatedAmount >= req.itemAmount){
              req.completed = true
            } else {
              canTake = false
            }
          }
        }
        if(req.level){
          if(character.level >= req.level){
            req.completed = true
          } else {
            canTake = false
          }
        }
        if(req.questId){
          const relatedQuestProgress = characterQuestProgress.find(qp => qp.questId === req.questId && qp.status === 'complete')
          if(relatedQuestProgress){
            req.completed = true
          } else {
            canTake = false
          }
        }
        if(req.stats){
          for(const propertyName of Object.getOwnPropertyNames(req.stats)){
            if(!propertyName) continue

            //@ts-ignore
            const characterStat: Stat = character.stats[propertyName]
            //@ts-ignore
            const questStat: Stat = req.stats[propertyName]
            if(characterStat.value >= questStat.value){
              req.completed = true
            } else {
              canTake = false
            }
          }
        }
      }
      
      const rewardItems = []
      for(const reward of q.rewards){
        if(reward.itemId){
          const relatedItem = relatedItems.find(ri => ri.id === reward.itemId)
          if(!relatedItem){
            const item = items.find(i => i.id === reward.itemId)
            rewardItems.push(item as Item)
          }
        }
      }
      
      const mergeItem: QuestWithQuestProgress = {
        quest: q,
        questGroup: group,
        questProgress: progress,
        canTakeQuest: canTake,
        canCompleteQuest: canComplete,
        questRequirementsQuests: relatedQuests,
        questRequirementsAchievements: relatedAchievements,
        questRequirementsItems: relatedItems,
        questRequirementsInventoryTxns: relatedTxns,
        questRewardItems: rewardItems,
        questMobs: relatedMobs
      }
      questsWithProgress.push(mergeItem)
    }

    return questsWithProgress
  }
}