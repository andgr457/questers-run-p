import { DateTime } from 'luxon'
import type { Achievement } from '../../interfaces/achievements/Achievement.types'
import { GuildRankByLevel, GuildRankLevelByRank, type Character, type Stat } from '../../interfaces/characters/Character.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { Quest, QuestCompletionRequirement, QuestGroup, QuestProgress, QuestRewardProgressItem, QuestStartRequirement, QuestStartRequirementStat } from '../../interfaces/quests/Quests.types'
import type { Mob, MobProgress } from '../../interfaces/mobs/Mob.types'
import { characterServiceGetItemAmount } from '../Character.Service'
import type { QuestWithQuestProgressItem } from '../../components/quests/CharacterQuests'

interface GetQuestWithProgressProps {
  quest: Quest,
  questGroup: QuestGroup,
  allQuestProgress: QuestProgress[],
  character: Character,
  allAchievements: Achievement[],
  allInventories: Inventory[],
  allItems: Item[],
  allQuests: Quest[],
  allMobProgress: MobProgress[],
  allMobs: Mob[],
}

export class QuestService {
  private formatTimeLeft(totalMinutes: number, startTime: DateTime | string) {
    const start = typeof startTime === 'string'
      ? DateTime.fromISO(startTime)
      : startTime

    const end = start.plus({ minutes: totalMinutes })
    const now = DateTime.now()

    const timeLeftSeconds = Math.max(
      0,
      Math.round(end.diff(now, 'seconds').seconds)
    )

    const totalSeconds = Math.round(totalMinutes * 60)

    return {
      totalTimeHours: Math.floor(totalMinutes / 60),
      totalTimeMinutes: totalMinutes,
      totalTimeSeconds: totalSeconds,

      timeLeftHours: timeLeftSeconds / 3600,
      timeLeftMinutes: (timeLeftSeconds % 3600) / 60,
      timeLeftSeconds,
    }
  }

  async getQuestWithQuestProgress(
    props: GetQuestWithProgressProps
  ): Promise<QuestWithQuestProgressItem> {
    const {
      quest,
      questGroup,
      allQuestProgress,
      character,
      allAchievements,
      allInventories,
      allItems,
      allQuests,
      allMobProgress,
      allMobs,
    } = props
    let canTakeQuest = false
    let canCompleteQuest = false
    const startRequirements: QuestStartRequirement[] = []
    const completionRequirements: QuestCompletionRequirement[] = []
    const rewards: QuestRewardProgressItem[] = []
    const characterMobProgress = allMobProgress.filter(mp => mp.characterId === character.id)
    const characterProgressItems = allQuestProgress.filter(aqp => aqp.characterId === character.id)
    const characterProgressItemInProgress = characterProgressItems.find(cpi => cpi.questId === quest.id && cpi.status === 'in-progress')
    const characterProgressItemComplete = characterProgressItems.find(cpi => cpi.questId === quest.id && cpi.status === 'complete')
    const characterInvenentoryBags = allInventories.filter(i => i.characterId === character.id)
    const isNonRepeatableAndComplete = quest.repeatable === false && typeof characterProgressItemComplete !== 'undefined'

    //start requirements
    for(const requirement of quest.startRequirements){
      const req = structuredClone(requirement)
      req.completed = false

      //start requirement - achievement needed
      if(req.achievementId){
        const characterHasAchivement = character.achievements.find(a => a.achievementId === req.achievementId)
        const achievement = allAchievements.find(a => a.id === req.achievementId)
        startRequirements.push({
          ...req,
          achivementTitle: achievement?.title,
          achivementDescription: achievement?.description,
          completed: typeof characterHasAchivement !== 'undefined',
        })    
      }
      //start requirement - item & amount needed
      if(req.itemId && typeof req.itemAmount === 'number'){
        const item = allItems.find(i => i.id === req.itemId)
        if(item){
          const characterInventoryItemAmount = characterServiceGetItemAmount(characterInvenentoryBags, item.id)
          startRequirements.push({
            ...req,
            itemName: item.name,
            itemDescription: item.description,
            itemCharacterAmount: characterInventoryItemAmount,
            completed: characterInventoryItemAmount >= req.itemAmount,
          })
        }
      }
      //start requirement - guild rank
      if(typeof req.guildRankLevel === 'number'){
        //@ts-ignore
        const reqGuildRank = GuildRankByLevel[req.guildRankLevel]
        const characterGuildRankLevel = GuildRankLevelByRank[character.guildRank]
        startRequirements.push({
          ...req,
          guildRank: reqGuildRank,
          completed: characterGuildRankLevel >= req.guildRankLevel
        })
      }
      //start requirement - level
      if(typeof req.level === 'number'){
        startRequirements.push({
          ...req,
          completed: character.level >= req.level
        })
      }
      //start requirement - quest completed
      if(req.questId){
        const reqQuest = allQuests.find(q => q.id === req.questId)
        const characterCompletedQuest = allQuestProgress.some(
          aqp => aqp.questId === reqQuest?.id &&
            aqp.characterId === character.id &&
            aqp.status === 'complete'
        )
        startRequirements.push({
          ...req,
          questTitle: reqQuest?.title,
          questDescription: reqQuest?.description,
          completed: characterCompletedQuest === true
        })
      }
      //start requirement - stats required
      if(req.stats){
        const startReqStats: QuestStartRequirementStat[] = []
        for(const propertyName of Object.getOwnPropertyNames(req.stats)){
          //@ts-ignore
          const reqStat: Stat = req.stats[propertyName]
          //@ts-ignore
          const charStat: Stat = character.stats[propertyName]
          startReqStats.push({
            statName: propertyName,
            charAmount: charStat.value,
            reqAmount: reqStat.value,
            completed: charStat.value >= reqStat.value
          })
        }
        startRequirements.push({
          ...req,
          reqStats: startReqStats,
          completed: startReqStats.every(srs => srs.completed === true)
        })
      }
    }

    //completion requirements
    for(const requirement of quest.completionRequirements){
      const req = structuredClone(requirement)
      req.completed = false

      //completion requirement - achievement needed
      if(req.achievementId){
        const characterHasAchivement = character.achievements.find(a => a.achievementId === req.achievementId)
        const achievement = allAchievements.find(a => a.id === req.achievementId)
        completionRequirements.push({
          ...req,
          achievementTitle: achievement?.title,
          achievementDescription: achievement?.description,
          completed: typeof characterHasAchivement !== 'undefined',
        })
      }

      //completion requirement - item & amount needed
      if(req.itemId && typeof req.itemAmount === 'number'){
        const item = allItems.find(i => i.id === req.itemId)
        if(item){
          const characterInventoryItemAmount = characterServiceGetItemAmount(characterInvenentoryBags, item.id)
          completionRequirements.push({
            ...req,
            itemName: item.name,
            itemDescription: item.description,
            itemCharacterAmount: characterInventoryItemAmount,
            itemProfessionType: item.profession?.type,
            completed: characterInventoryItemAmount >= req.itemAmount,
          })
        }
      }

      //completion requirement - mob & amount
      if(req.mobId && typeof req.mobAmount === 'number'){
        const mob = allMobs.find(m => m.id === req.mobId)
        //only count mob defeats where the character was in progress for the quest
        const characterMobProgressItems = characterMobProgress.filter(
          cmp => cmp.mobId === req.mobId && 
          cmp.questProgressId === characterProgressItemInProgress?.id
        )
        completionRequirements.push({
          ...req,
          mobId: mob?.id,
          mobName: mob?.name,
          mobDescription: mob?.description,
          mobLevel: mob?.level,
          mobCharacterAmount: characterMobProgressItems.length,
          mobLocationType: mob?.location,
          completed: characterMobProgressItems.length >= req.mobAmount
        })
      }

      //completion requirement - time based
      if(typeof req.timeMinutes === 'number'){
        const inProgressStartTime = DateTime.fromISO(characterProgressItemInProgress?.startDate as string)
        if(!inProgressStartTime.isValid){
          completionRequirements.push({
            ...req
          })
        } else {
          const timeLeft = this.formatTimeLeft(
            req.timeMinutes,
            inProgressStartTime
          )

          completionRequirements.push({
            ...req,
            completed: timeLeft.timeLeftSeconds <= 0,
            timeHours: timeLeft.totalTimeHours,
            timeSeconds: timeLeft.totalTimeSeconds,
          })
        }
      }
    }

    //quest rewards
    for(const reward of quest.rewards){
      const rew = structuredClone(reward)
      if(rew.achivementId){
        const achievement = allAchievements.find(a => a.id === rew.achivementId)
        rewards.push({
          achivementId: rew.achivementId,
          achievementTitle: achievement?.title
        })
      }
      if(rew.itemId && typeof rew.itemAmount === 'number'){
        const item = allItems.find(i => i.id === rew.itemId)
        rewards.push({
          itemId: rew.itemId,
          itemName: item?.name,
          itemAmount: rew.itemAmount
        })
      }
      if(typeof rew.xp === 'number'){
        rewards.push({
          xp: rew.xp
        })
      }
    }

    if(quest.repeatable === false){
      if(characterProgressItemComplete){
        //not repeatable and complete cant take
        canTakeQuest = false
      } else {
        //not repeatable and not complete can take
        canTakeQuest = true
      }
    } else {
      if(characterProgressItemComplete){
        //repeatable and in progress cant take
        canTakeQuest = false
      } else {
        //repeatable and not in progress can take
        canTakeQuest = true
      }
    }

    const anyInProgress = allQuestProgress.some(aqp => aqp.status === 'in-progress')
    if(anyInProgress){
      canTakeQuest = false
    } else {
      canTakeQuest = true
    }

    let questProgress = characterProgressItemInProgress
    if(isNonRepeatableAndComplete === true){
      questProgress = characterProgressItemComplete
      canTakeQuest = false
    }

    if(completionRequirements.every(req => req.completed === true)){
      canCompleteQuest = true
    }

    return {
      quest: structuredClone(quest),
      questGroup: questGroup,
      questProgress,

      canTakeQuest,
      canCompleteQuest,

      startRequirements,
      completionRequirements,

      questRewardItems: rewards
    }
  }
}