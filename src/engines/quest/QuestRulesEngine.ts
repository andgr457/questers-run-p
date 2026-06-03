import type { Quest } from '../../interfaces/quests/Quests.types'
import type { Character } from '../../interfaces/characters/Character.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { Achievement } from '../../interfaces/achievements/Achievement.types'
import type { MobProgress } from '../../interfaces/mobs/Mob.types'
import type { QuestProgress } from '../../interfaces/quests/Quests.types'
import { getStartRequirements, getCompletionRequirements } from '../../components/quests/utils/questState.utils'

export interface QuestRulesContext {
  quest: Quest
  character: Character

  allQuestProgress: QuestProgress[]
  allInventories: Inventory[]
  allMobProgress: MobProgress[]

  items: Item[]
  achievements: Achievement[]

  now: number
}

/**
 * FULL QUEST EVALUATION RESULT
 */
export interface QuestRulesResult {
  questProgress: QuestProgress | null

  startRequirements: ReturnType<
    typeof getStartRequirements
  >

  completionRequirements: ReturnType<
    typeof getCompletionRequirements
  >

  canTakeQuest: boolean
  canCompleteQuest: boolean
  inProgress: boolean
}

/**
 * QUEST RULES ENGINE
 */
export class QuestRulesEngine {
  static evaluate(
    ctx: QuestRulesContext,
  ): QuestRulesResult {
    const {
      quest,
      character,
      allQuestProgress,
      allInventories,
      allMobProgress,
      now,
    } = ctx

    /**
     * 1. BASE PROGRESS
     */

    /**
     * 2. START REQUIREMENTS
     */
    const startRequirements = getStartRequirements({
      quest,
      character,
      allQuestProgress,
      allInventories,
    })

    /**
     * 3. COMPLETION REQUIREMENTS (timer-aware)
     */
    const completionRequirements =
      getCompletionRequirements({
        quest,
        character,
        allQuestProgress,
        allMobProgress,
        allInventories,
        now,
      })

    /**
     * 4. ACTION STATE
     */
    const allCharProgress = allQuestProgress.filter(aqp => 
      aqp.characterId === character.id
    )
    let anyInProgress = false
    let oneTimeQuestCompleted = false
    let thisQuestProgress = undefined
    let oneTimeQuestCompleteProgress = undefined
    for(const p of allCharProgress){
      if(p.questId === quest.id){
        if(p.status === 'complete' && quest.repeatable === false){
          oneTimeQuestCompleted = true
          oneTimeQuestCompleteProgress = p
        } else if (p.status === 'in-progress'){
          thisQuestProgress = p
        }
      }
      if(p.status === 'in-progress'){
        anyInProgress = true
      }
    }
    
    const canTakeQuest =
      oneTimeQuestCompleted === false &&
      startRequirements.every(r => r.completed) &&
      anyInProgress === false

    const canCompleteQuest =
      thisQuestProgress?.status === 'in-progress' &&
      completionRequirements.every(r => r.completed)

    
    return {
      questProgress: oneTimeQuestCompleteProgress ?? thisQuestProgress as QuestProgress,
      startRequirements,
      completionRequirements,
      canTakeQuest,
      canCompleteQuest,
      inProgress: typeof thisQuestProgress !== 'undefined',
    }
  }
}