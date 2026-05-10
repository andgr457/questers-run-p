import { DateTime } from 'luxon';
import type { QuestWithQuestProgress } from '../../components/quests/CharacterQuests';
import type { Achievement } from '../../interfaces/achievements/Achievement.types';
import type { Character } from '../../interfaces/characters/Character.types';
import type { Inventory, InventoryTransaction } from '../../interfaces/inventories/Inventory.types';
import type { Item } from '../../interfaces/items/Item.types';
import type { Quest, QuestGroup, QuestProgress } from '../../interfaces/quests/Quests.types';
import { AchievementRepository } from '../../repository/achievements/AchievementRepository';
import { ItemRepository } from '../../repository/items/ItemRepository';

export class QuestService {
  protected achievementRepo: AchievementRepository
  protected itemRepo: ItemRepository
  constructor(){
    this.achievementRepo = new AchievementRepository()
    this.itemRepo = new ItemRepository()
  }

  async getQuestsWithQuestProgress(
    character: Character, 
    quests: Quest[], 
    questGroups: QuestGroup[], 
    characterQuestProgress: QuestProgress[],
    characterInventories: Inventory[]
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
      const relatedItems: Item[] = []
      const relatedQuests: Quest[] = []
      const relatedTxns: InventoryTransaction[] = []
      for(const req of q.startRequirements){
        if(req.itemId){
          if(!relatedItems.find(ri => ri.id === req.itemId)){
            const item = await this.itemRepo.byId(req.itemId)
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
            const achievement = await this.achievementRepo.byId(req.achievementId)
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
        if(req.itemId){
          if(!relatedItems.find(ri => ri.id === req.itemId)){
            const item = await this.itemRepo.byId(req.itemId)
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
            const achievement = await this.achievementRepo.byId(req.achievementId)
            relatedAchievements.push(achievement as Achievement)
          }
        }
      }

      for(const req of q.completionRequirements){
        if(req.achievementId){
          if(character.achievements.find(a => a.achievementId === req.achievementId)){
            req.completed = true
          } else {
            canComplete = false
          }
          if(!relatedAchievements.find(ra => ra.id === req.achievementId)){
            relatedAchievements.push()
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
              canComplete = false
            }
          }
        }

        if(req.timeMinutes){
          if(progress?.startDate){
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
      
      let canTake = !anyQuestInProgress
      for(const req of q.startRequirements){
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
      
      for(const reward of q.rewards){
        if(reward.itemId){
          const relatedItem = relatedItems.find(ri => ri.id === reward.itemId)
          if(!relatedItem){
            const item = await this.itemRepo.byId(reward.itemId)
            relatedItems.push(item as Item)
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
        questRequirementsInventoryTxns: relatedTxns
      }
      questsWithProgress.push(mergeItem)
    }

    return questsWithProgress
  }
}