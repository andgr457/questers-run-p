import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'
import CharacterQuestRequirement from './CharacterQuestRequirement'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Quest, QuestGroup } from '../../interfaces/quests/Quests.types'
import { QuestService } from '../../services/quests/QuestService'
import type { QuestWithQuestProgressItem } from './CharacterQuests'

interface CharacterQuestProps extends AppProperties {
  showActions?: boolean
  quest: Quest
  showOneTimeCompletedQuests: boolean
  showIneligibleQuests: boolean
  questItemClassName?: string
  questId?: string
}

export default function CharacterQuest(props: CharacterQuestProps) {
  const {
    quest,
    achievements,
    character,
    // characterQuestProgress,
    // allQuestsWithProgress,
    showActions,
    items,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    questItemClassName = 'quest-item',
    showOneTimeCompletedQuests,
    showIneligibleQuests,
    mobs,
    // characterMobProgress,
    quests,
    questGroups,
    // setAllQuestsWithQuestProgress,
    allQuestProgress,
    allInventories,
    allMobProgress,
  } = props

  const [progressItem, setProgressItem] = useState<QuestWithQuestProgressItem | null>(null)
  const [loading, setLoading] = useState(false)
  const loadProgressItem = useCallback(async () => {
    if (!quest || !character) return

    setLoading(true)

    const questService = new QuestService()

    const progress = await questService.getQuestWithQuestProgress({
      quest,
      questGroup: questGroups?.find(qg => qg.id === quest.groupId) as QuestGroup,
      allAchievements: achievements ?? [],
      allInventories: allInventories ?? [],
      allItems: items ?? [],
      allMobs: mobs ?? [],
      allMobProgress: allMobProgress ?? [],
      allQuestProgress: allQuestProgress ?? [],
      allQuests: quests ?? [],
      character,
    })

    setProgressItem(progress)
    setLoading(false)
  }, [
    quest,
    character,
    questGroups,
    achievements,
    items,
    mobs,
    allInventories,
    allMobProgress,
    allQuestProgress,
    quests,
  ])

    // initial load
  useEffect(() => {
    loadProgressItem()
  }, [loadProgressItem])

  // optional external refresh hook
  const handleRefreshClick = async () => {
    await loadProgressItem()
  }

  let statusContent = ''
  if (progressItem?.questProgress?.status === 'in-progress') {
    statusContent = 'inprogress'
  }

  if (
    quest.repeatable === false &&
    progressItem?.questProgress?.status === 'complete'
  ) {
    statusContent = 'completed'
  }

  const showButtons = showActions === true

  if(!progressItem){
    return <div>Loading...</div>
  }

  if(progressItem.quest.repeatable === false && 
    progressItem.questProgress?.status === 'complete' &&
    !showOneTimeCompletedQuests
  ){
    return null
  }

  if(!showIneligibleQuests && !progressItem.startRequirements.every(req => req.completed === true)){
    return null
  }

  return (
    <div id={progressItem.quest.id}>
      <div
        className={`${questItemClassName} ${
          progressItem?.canCompleteQuest === true
            ? 'complete'
            : ''
        }`}
      >
        {showButtons === true && (
          <div className='quest-actions'>
            {progressItem.canTakeQuest === true && (
              <button
                className='success'
                disabled={loading}
                onClick={async () => {
                  await handleAddQuest?.(
                    progressItem.quest,
                    character?.id as string,
                  )
                  
                }}
              >
                Take
              </button>
            )}

            {progressItem?.questProgress?.status === 'in-progress' && (
              <>
                {progressItem.canCompleteQuest === false && (
                  <button
                    className="danger"
                    onClick={async () => {
                      await handleAbandonQuest?.(
                        progressItem?.questProgress?.id as string,
                      )
                      
                    }}
                  >
                    Abandon
                  </button>
                )}

                {progressItem.canCompleteQuest === false && <button
                  className="success"
                  onClick={async () => {
                    await handleRefreshClick()
                    
                  }}
                >
                  Refresh
                </button>}
              </>
            )}

            {progressItem?.questProgress?.status === 'in-progress' &&
              progressItem.canCompleteQuest === true && (
                <button
                  className='success'
                  onClick={async () => {
                    await handleCompleteQuest?.(
                      progressItem,
                    )
                    
                  }}
                >
                  Complete
                </button>
              )}

            {statusContent && (
              <div
                className={`quest-status ${statusContent}`}
              >
                {statusContent}
              </div>
            )}
          </div>
        )}

        <div className='quest-item-header'>
          {progressItem.quest?.title}
        </div>

        <div className='quest-item-date'>
          {progressItem.quest?.repeatable === true
            ? 'repeatable'
            : 'one-time quest'}
        </div>

        {progressItem && (
          <div>
            {progressItem.questProgress?.startDate && (
              <div className='quest-item-date'>
                <div>
                  Started on{' '}
                  {DateTime.fromISO(
                    progressItem.questProgress?.startDate as string,
                  )
                    .toLocal().toLocaleString(
                      DateTime.DATETIME_SHORT_WITH_SECONDS,
                    )}
                </div>
              </div>
            )}

            {progressItem.quest.repeatable === false 
              && progressItem.questProgress?.status === 'complete'
              && progressItem.questProgress?.endDate && (
                <div className='quest-item-date'>
                  <div>
                    Completed on{' '}
                    {DateTime.fromISO(
                      progressItem.questProgress.endDate as string,
                    )
                      .toLocal().toLocaleString(
                        DateTime.DATETIME_SHORT_WITH_SECONDS,
                      )}
                  </div>
                </div>
              )}
          </div>
        )}

        <div className='quest-item-description'>
          {progressItem.quest.description}
        </div>

        <div className='quest-sections'>
          <div>
            <div
              className={`quest-item-requirements-header ${
                progressItem?.startRequirements?.filter(
                  req => req.completed === true,
                ).length ===
                progressItem.quest?.startRequirements.length
                  ? 'success'
                  : ''
              }`}
            >
              {progressItem?.startRequirements?.filter(
                req => req.completed === true,
              )?.length ?? 0}{' '}
              / {progressItem.quest?.startRequirements?.length ?? 0}{' '}
              Take Requirements
            </div>

            <div className='quest-item-requirements-list'>
              {progressItem?.startRequirements?.map(
                (r, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        r.completed === true
                          ? 'quest-item-requirements-item completed'
                          : 'quest-item-requirements-item'
                      }
                    >
                      <div>
                        {!r.stats && <div
                          style={{
                            float: 'left',
                          }}
                        >
                          {r.completed === true
                            ? '✔'
                            : '✘'}
                        </div>}

                        {typeof r.level === 'number' && (
                          <>
                            Level{' '}
                            <strong>
                              {r.level}
                            </strong>
                          </>
                        )}

                        {r.questId && (
                          <div
                            title={
                              r.questDescription
                            }
                          >
                            Quest:{' '}
                            <strong>
                              {
                                r.questTitle
                              }
                            </strong>
                          </div>
                        )}

                        {r.achievementId && (
                          <div
                            title={
                              r?.achivementDescription
                            }
                          >
                            Achievement:{' '}
                            <strong>
                              {
                                r.achivementTitle
                              }
                            </strong>
                          </div>
                        )}

                        {r.itemId &&
                          typeof r.itemAmount === 'number' && (
                            <>
                              <strong>
                                {Math.min(
                                  r.itemCharacterAmount ?? 0,
                                  r.itemAmount,
                                )}
                                /{r.itemAmount}{' '}
                                {r.itemName}
                              </strong>
                            </>
                          )}

                        {r.guildRank && (
                          <div>
                            Guild Rank:{' '}
                            <strong>
                              {r.guildRank}
                            </strong>
                          </div>
                        )}

                        {r.reqStats && (
                          <>
                            {r.reqStats.map(
                              (reqStat) => {
                                if (
                                  reqStat.reqAmount === 0
                                ) {
                                  return null
                                }

                                return (
                                  <div
                                    key={
                                      `${reqStat.statName}_${progressItem.quest.id}`
                                    }
                                  >
                                    {reqStat.completed === true
                                      ? '✔'
                                      : '✘'}{' '}
                                    {reqStat.statName.toUpperCase()}:{' '}
                                    <strong>
                                      {
                                        reqStat.reqAmount
                                      }
                                    </strong>
                                  </div>
                                )
                              },
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>

          <div>
            <div
              className={`quest-item-requirements-header ${
                progressItem?.completionRequirements?.filter(
                  req => req.completed === true,
                )?.length === quest.completionRequirements?.length
                  ? 'success'
                  : ''
              }`}
            >
              {progressItem?.completionRequirements?.filter(
                req => req.completed === true,
              )?.length ?? 0}{' '}
              /{' '}
              {progressItem.quest?.completionRequirements?.length ?? 0}{' '}
              Completed Requirements
            </div>

            <div className='quest-item-requirements-list'>
              {progressItem?.completionRequirements?.map(
                (r, index) => {
                 
                  return (
                    <CharacterQuestRequirement
                      key={`${index}_completion_${progressItem.quest.id}`}
                      req={r}
                      
                      startDate={
                        progressItem?.questProgress?.startDate
                      }
                      handleRefresh={handleRefreshClick}
                    />
                  )
                },
              )}
            </div>
          </div>

          <div>
            <div className='quest-item-requirements-header success'>
              Rewards
            </div>

            <div className='quest-item-requirements-list'>
              {progressItem.questRewardItems.map(
                (r, index) => {
                  return (
                    <div
                      key={index}
                      className='quest-item-requirements-item'
                    >
                      <div>
                        {typeof r.xp === 'number' && (
                          <>
                            XP:{' '}
                            <strong>
                              {r.xp.toLocaleString()}
                            </strong>
                          </>
                        )}

                        {r.itemId &&
                          typeof r.itemAmount === 'number' && (
                            <>
                              {
                                r.itemName
                              }
                              :{' '}
                              <strong>
                                {
                                  r.itemAmount
                                }
                              </strong>
                            </>
                          )}

                        {r.achivementId && (
                          <>
                            Achievement:{' '}
                            <strong>
                              {
                                r.achievementTitle
                              }
                            </strong>
                          </>
                        )}
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>

          <div>
            <div className='quest-item-date'>
              {allQuestProgress?.filter(
                aqp => aqp.characterId === character.id &&
                  aqp.questId === progressItem.quest.id &&
                  aqp.status === 'complete'
              )?.length}{' '}
              completed.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}