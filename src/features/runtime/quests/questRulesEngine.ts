

import { getCompletionRequirements, getStartRequirements } from '../../../components/quests/utils/questState.utils'
import { questRuntimeStore } from './questRuntimeStore'
import type {
  QuestRulesContext,
  QuestRulesResult,
} from './types'

export class QuestRulesEngine {
  static evaluate(
    ctx: QuestRulesContext
  ): QuestRulesResult {
    const {
      quest,
      character,
      questProgress,
      inventories,
      mobProgress,
      now,
    } = ctx

    // =========================
    // START REQUIREMENTS
    // =========================
    const startRequirements =
      getStartRequirements({
        quest,
        character,
        allQuestProgress: questProgress,
        allInventories: inventories,
      })

    // =========================
    // COMPLETION REQUIREMENTS
    // =========================
    const completionRequirements =
      getCompletionRequirements({
        quest,
        character,
        allQuestProgress: questProgress,
        allMobProgress: mobProgress,
        allInventories: inventories,
        now,
      })

    // =========================
    // QUEST STATE FROM STORE
    // =========================
    const activeQuest =
      questRuntimeStore.getActive(
        character.id,
        quest.id
      )

    const anyQuestLocked =
      questRuntimeStore.isQuestLocked(
        character.id
      )

    const oneTimeCompleted = questProgress.some(
      q =>
        q.questId === quest.id &&
        q.status === 'complete' &&
        !quest.repeatable
    )

    const canTakeQuest =
      !oneTimeCompleted &&
      startRequirements.every(r => r.completed) &&
      !anyQuestLocked

    const canCompleteQuest =
      !!activeQuest &&
      completionRequirements.every(
        r => r.completed
      )

    return {
      questProgress: activeQuest ?? null,
      startRequirements,
      completionRequirements,
      canTakeQuest,
      canCompleteQuest,
      inProgress: !!activeQuest,
    }
  }
}