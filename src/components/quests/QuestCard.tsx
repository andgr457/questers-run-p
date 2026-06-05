import { useMemo } from 'react'

import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Quest, QuestProgress } from '../../interfaces/quests/Quests.types'

import { useGameClock } from '../../hooks/useGameClock'

import { QuestRulesEngine } from '../../engines/quest/QuestRulesEngine'

import QuestActions from './sections/QuestActions'
import QuestHeader from './sections/QuestHeader'
import QuestMeta from './sections/QuestMeta'
import QuestStartRequirements from './sections/QuestStartRequirements'
import QuestCompletionRequirements from './sections/QuestCompletionRequirements'
import QuestRewardsSection from './sections/QuestRewardsSection'
import { buildQuestRewardsUI } from './utils/questReward.utils'
import { getQuestRequirementObjectsForUI } from './utils/questRequirements.utils'

interface QuestCardProps extends AppProperties {
  showActions?: boolean
  quest: Quest
  showOneTimeCompletedQuests: boolean
  showIneligibleQuests: boolean
  questItemClassName?: string
  questId?: string
}

export default function QuestCard(props: QuestCardProps) {
  const now = useGameClock()

  const {
    quest,
    character,
    showActions,
    items,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    questItemClassName = 'quest-item',
    showOneTimeCompletedQuests,
    showIneligibleQuests,
    mobs,
    allQuestProgress,
    allInventories,
    allMobProgress,
    achievements,
    quests,
  } = props

  /**
   * 🧠 SINGLE SOURCE OF RULES
   * Now QUEST ENGINE is PURE validation,
   * runtime lock is handled internally via ActivityRuntimeService
   */
  const rules = useMemo(() => {
    return QuestRulesEngine.evaluate({
      quest,
      character,

      // still needed for completion logic
      allQuestProgress: allQuestProgress ?? [],
      allInventories: allInventories ?? [],
      allMobProgress: allMobProgress ?? [],

      items: items ?? [],
      achievements: achievements ?? [],
      now,
    })
  }, [
    quest,
    character,
    allQuestProgress,
    allInventories,
    allMobProgress,
    items,
    achievements,
    now,
  ])

  /**
   * FILTER RULES
   */
  if (
    quest.repeatable === false &&
    rules.questProgress?.status === 'complete' &&
    !showOneTimeCompletedQuests
  ) {
    return null
  }

  if (
    !showIneligibleQuests &&
    !rules.startRequirements.every(r => r.completed)
  ) {
    return null
  }

  const showButtons = showActions === true

  /**
   * STATUS = derived ONLY from runtime quest progress
   */
  const statusContent =
    rules.questProgress?.status === 'in-progress'
      ? 'inprogress'
      : quest.repeatable === false &&
        rules.questProgress?.status === 'complete'
      ? 'completed'
      : ''

  const rewards = useMemo(() => {
    return buildQuestRewardsUI({
      quest,
      items: items ?? [],
      achievements: achievements ?? [],
    })
  }, [quest, items, achievements])

  const requirementData = useMemo(() => {
    return getQuestRequirementObjectsForUI(
      quest,
      achievements ?? [],
      mobs ?? [],
      items ?? [],
      quests ?? []
    )
  }, [quest, achievements, mobs, items, quests])

  return (
    <div id={quest.id}>
      <div
        className={`${questItemClassName} ${
          rules.canCompleteQuest ? 'complete' : ''
        }`}
      >
        {/* ACTIONS */}
        {showButtons && (
          <QuestActions
            loading={false}
            canTakeQuest={rules.canTakeQuest}
            canCompleteQuest={rules.canCompleteQuest}
            inProgress={rules.inProgress}
            statusContent={statusContent}
            onTake={async () => {
              await handleAddQuest?.(
                quest,
                character?.id as string
              )
            }}
            onAbandon={async () => {
              await handleAbandonQuest?.(
                rules.questProgress?.id as string
              )
            }}
            onComplete={async () => {
              await handleCompleteQuest?.(
                rules.questProgress as QuestProgress,
                rewards,
                rules.completionRequirements,
                quest.title
              )
            }}
          />
        )}

        {/* HEADER */}
        <QuestHeader
          title={quest.title}
          repeatable={quest.repeatable}
        />

        {/* META */}
        <QuestMeta
          startDate={rules.questProgress?.startDate}
          endDate={rules.questProgress?.endDate}
          repeatable={quest.repeatable}
          completed={
            rules.questProgress?.status === 'complete'
          }
        />

        {/* DESCRIPTION */}
        <div className="quest-item-description">
          {quest.description}
        </div>

        {/* SECTIONS */}
        <div className="quest-sections">
          <QuestStartRequirements
            requirements={rules.startRequirements}
            questId={quest.id}
            requirementData={requirementData}
          />

          <QuestCompletionRequirements
            requirements={rules.completionRequirements}
            questId={quest.id}
            startDate={rules.questProgress?.startDate}
            now={now}
            requirementData={requirementData}
          />

          <QuestRewardsSection rewards={rewards ?? []} />

          <div className="quest-item-date">
            {allQuestProgress?.filter(
              aqp =>
                aqp.characterId === character.id &&
                aqp.questId === quest.id &&
                aqp.status === 'complete'
            ).length ?? 0}{' '}
            completed.
          </div>
        </div>
      </div>
    </div>
  )
}