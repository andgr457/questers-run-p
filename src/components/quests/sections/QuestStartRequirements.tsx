import { GuildRankByLevel } from '../../../interfaces/characters/Character.types'
import type { QuestStartRequirement } from '../../../interfaces/quests/Quests.types'
import type { QuestRequirementObjectsForUI } from '../utils/questRequirements.utils'

interface Props {
  requirements: QuestStartRequirement[]
  questId: string
  requirementData: QuestRequirementObjectsForUI
}

export default function QuestStartRequirements({
  requirements,
  questId,
  requirementData
}: Props) {
  const completedCount =
    requirements.filter(r => r.completed).length

  const total = requirements.length
  
  return (
    <div>
      <div
        className={`quest-item-requirements-header ${
          completedCount === total ? 'success' : ''
        }`}
      >
        {completedCount} / {total} Take Requirements
      </div>

      <div className="quest-item-requirements-list">
        {requirements.map((r, index) => {
          const item = requirementData.questItems.find(i => i.id === r.itemId)
          const achievement = requirementData.questAchievements.find(a => a.id === r.achievementId)
          const reqQuest = requirementData.questQuests.find(q => q.id === r.questId)
          return <div
            key={`${questId}_start_${index}`}
            className={
              r.completed
                ? 'quest-item-requirements-item completed'
                : 'quest-item-requirements-item'
            }
          >
            <div>
              {/* LEVEL */}
              {typeof r.level === 'number' && (
                <>
                  Level <strong>{r.level}</strong>
                </>
              )}

              {/* QUEST REQUIREMENT */}
              {reqQuest && (
                <div title={reqQuest?.description}>
                  Quest:{' '}
                  <strong>{reqQuest?.title}</strong>
                </div>
              )}

              {/* ACHIEVEMENT REQUIREMENT */}
              {achievement && (
                <div title={achievement.description}>
                  Achievement:{' '}
                  <strong>{achievement.title}</strong>
                </div>
              )}

              {/* ITEM REQUIREMENT */}
              {item &&
                typeof r.itemAmount === 'number' && (
                  <strong>
                    {Math.min(
                      r.itemCharacterAmount ?? 0,
                      r.itemAmount,
                    )}
                    /{r.itemAmount} {item.name}
                  </strong>
                )}

              {/* GUILD RANK */}
              {typeof r.guildRankLevel === 'number' && (
                <div>
                  Guild Rank:{' '}
                  <strong>{
                    //@ts-ignore
                    GuildRankByLevel[r.guildRankLevel]
                  }</strong>
                </div>
              )}

              {/* STATS */}
              {r.reqStats && (
                <>
                  {r.reqStats.map(reqStat => {
                    if (reqStat.reqAmount === 0)
                      return null

                    return (
                      <div
                        key={`${questId}_${reqStat.statName}`}
                      >
                        {reqStat.completed ? '✔' : '✘'}{' '}
                        {reqStat.statName.toUpperCase()}:{' '}
                        <strong>
                          {reqStat.reqAmount}
                        </strong>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}