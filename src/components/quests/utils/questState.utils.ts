import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import { GuildRankLevelByRank, type Character } from '../../../interfaces/characters/Character.types'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { MobProgress } from '../../../interfaces/mobs/Mob.types'

import { DateTime } from 'luxon'
import type { Quest, QuestProgress, QuestStartRequirement, QuestCompletionRequirement, QuestReward } from '../../../interfaces/quests/Quests.types'
import { getCharacterItemAmount } from '../../../services/characters/characterInventory.utils'

/**
 * 1. QUEST PROGRESS
 */
export function getQuestProgress({
  quest,
  character,
  allQuestProgress,
}: {
  quest: Quest
  character: Character
  allQuestProgress: QuestProgress[]
}) {
  const characterProgress = allQuestProgress.filter(
    p => p.characterId === character.id,
  )

  return (
    characterProgress.find(p => p.questId === quest.id && p.status === 'in-progress') ??
    null
  )
}

/**
 * 2. START REQUIREMENTS
 */
export function getStartRequirements({
  quest,
  character,
  allQuestProgress,
  allInventories,
}: {
  quest: Quest
  character: Character
  allQuestProgress: QuestProgress[]
  allInventories: Inventory[]
}) {
  return quest.startRequirements.map(req => {
    const r: QuestStartRequirement = structuredClone(req)
    r.completed = false

    // LEVEL
    if (typeof r.level === 'number') {
      r.completed = character.level >= r.level
    }

    // QUEST COMPLETION
    if (r.questId) {
      r.completed = allQuestProgress.some(
        p =>
          p.characterId === character.id &&
          p.questId === r.questId &&
          p.status === 'complete',
      )
    }

    // ACHIEVEMENT
    if (r.achievementId) {
      r.completed = character.achievements.some(
        a => a.achievementId === r.achievementId,
      )
    }

    // ITEM
    if (r.itemId && typeof r.itemAmount === 'number') {
      const total = allInventories
        .filter(i => i.characterId === character.id)
        .flatMap(i => i.transactions)
        .filter(t => t.itemId === r.itemId)
        .reduce((sum, t) => sum + (t.quantity ?? 0), 0)

      r.itemCharacterAmount = total
      r.completed = total >= r.itemAmount
    }

    // GUILD RANK
    if (typeof r.guildRankLevel === 'number') {
      const charGuildRankLevel = GuildRankLevelByRank[character.guildRank]
      r.completed =
        charGuildRankLevel >= r.guildRankLevel
    }

    // STATS
    if (r.stats) {
      const results = Object.keys(r.stats).map(key => {
        const reqStat = (r.stats as any)[key]
        const charStat = (character.stats as any)[key]

        return {
          statName: key,
          reqAmount: reqStat.value,
          charAmount: charStat.value,
          completed:
            charStat.value >= reqStat.value,
        }
      })

      r.reqStats = results as any
      r.completed = results.every(s => s.completed)
    }

    return r
  })
}

/**
 * 3. COMPLETION REQUIREMENTS (TIMER-SAFE)
 */
export function getCompletionRequirements({
  quest,
  character,
  allQuestProgress,
  allMobProgress,
  allInventories,
  now,
}: {
  quest: Quest
  character: Character
  allQuestProgress: QuestProgress[]
  allMobProgress: MobProgress[]
  allInventories: Inventory[]
  now: number
}) {
  const progress = getQuestProgress({
    quest,
    character,
    allQuestProgress,
  })

  return quest.completionRequirements.map(req => {
    const r: QuestCompletionRequirement = structuredClone(req)
    r.completed = false
    if(!progress){
      return req
    }

    const startTime = progress?.startDate
      ? DateTime.fromISO(progress.startDate)
      : null

    /**
     * ACHIEVEMENT
     */
    if (r.achievementId) {
      r.completed = character.achievements.some(
        a => a.achievementId === r.achievementId,
      )
    }

    /**
     * ITEM PROGRESS
     */
    if (r.itemId && typeof r.itemAmount === 'number') {
      const charItemAmount = getCharacterItemAmount(
        allInventories.filter(i => i.characterId === character.id),
        r.itemId
      ) ?? 0
      r.completed = charItemAmount >= r.itemAmount
    }

    /**
     * MOB PROGRESS
     */
    if (r.mobId && typeof r.mobAmount === 'number') {
      const count = allMobProgress.filter(
        m =>
          m.characterId === character.id &&
          m.mobId === r.mobId &&
          m.questProgressId === progress?.id,
      ).length

      r.mobCharacterAmount = count
      r.completed = count >= r.mobAmount
    }

    /**
     * TIMER LOGIC (CLEAN — NO DERIVED FIELDS)
     */
    if (typeof r.timeMinutes === 'number' && startTime) {
      const end = startTime.plus({ minutes: r.timeMinutes })

      const nowDt = DateTime.fromMillis(now)

      r.completed = nowDt >= end
    }

    return r
  })
}

/**
 * 4. REWARDS
 */
export function getQuestRewards({
  quest,
  items,
  achievements,
}: {
  quest: Quest
  items: Item[]
  achievements: Achievement[]
}) {
  return quest.rewards.map(reward => {
    const r: QuestReward = { ...reward } as any

    if (r.itemId) {
      const item = items.find(i => i.id === r.itemId)
      return {
        ...r,
        itemName: item?.name,
      }
    }

    if (r.achivementId) {
      const ach = achievements.find(
        a => a.id === r.achivementId,
      )
      return {
        ...r,
        achievementTitle: ach?.title,
      }
    }

    return r
  })
}

/**
 * 5. QUEST ACTION STATE
 */
export function getQuestActionsState({
  questProgress,
  startRequirements,
  completionRequirements,
}: {
  quest: Quest
  questProgress: QuestProgress | null
  startRequirements: QuestStartRequirement[]
  completionRequirements: QuestCompletionRequirement[]
}) {
  const canTake =
    startRequirements.every(r => r.completed) &&
    !questProgress

  const canComplete =
    questProgress?.status === 'in-progress' &&
    completionRequirements.every(r => r.completed)

  const inProgress =
    questProgress?.status === 'in-progress'

  return {
    canTake,
    canComplete,
    inProgress,
  }
}