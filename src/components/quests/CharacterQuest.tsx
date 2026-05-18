import { DateTime } from 'luxon'
import CharacterQuestRequirement from './CharacterQuestRequirement'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Quest } from '../../interfaces/quests/Quests.types'
import StateOverlay from '../state-overlay/StateOverlay'
import { useState } from 'react'
import { QUEST_INTRO_IDS } from '../../data/quests/Quests.Intro.data'

interface CharacterQuestProps extends AppProperties {
  handleShowPopup: (popupType: 'quest' | 'quest-group', relatedId: string) => void
  showActions?: boolean
  quest: Quest
  showOneTimeCompletedQuests: boolean
  showIneligibleQuests: boolean
  questItemClassName?: string
}

export default function CharacterQuest(props: CharacterQuestProps){
    const {
      achievements,
      character,
      characterQuestProgress,
      allQuestsWithProgress,
      showActions,
      items,
      quest,
      handleAddQuest,
      handleAbandonQuest,
      handleCompleteQuest,
      questItemClassName = 'quest-item',
      showOneTimeCompletedQuests,
      showIneligibleQuests,
    } = props
    const [hideBlur, setHideBlur] = useState(false)

    const characterAllProgress = allQuestsWithProgress?.filter(q => q.questProgress?.characterId === character?.id)
    const characterQuestAllProgress = characterAllProgress?.filter(q => q.questProgress?.questId === quest?.id)
    const completeProgress = characterQuestAllProgress?.filter(q => q.questProgress?.status === 'complete') ?? []
    const anyPendingProgress = characterAllProgress?.filter(q => q.questProgress?.status === 'in-progress') ?? []
    const thisQuestCharacterProgress = characterQuestAllProgress?.find(p => p.questProgress?.id === characterQuestProgress?.questProgress?.id)
    const thisQuestProgress = allQuestsWithProgress?.find(q => q.quest.id === quest.id)
    
    let canTake = false
    if(anyPendingProgress.length === 0){
      if(quest.repeatable === true){
        canTake = thisQuestProgress?.canTakeQuest ?? true
      } else {
        if(completeProgress.length === 0){
          canTake = true
        }
      }
    }

    let statusContent = thisQuestCharacterProgress?.questProgress?.status === 'in-progress'
      ? 'inprogress'
      : thisQuestCharacterProgress?.questProgress?.status === 'complete'
      ? 'completed'
      : ''

    if(quest.repeatable === false){
      if(completeProgress.length === 1){
        statusContent = ''
      }
    }

    const showButtons = !showActions ? false : true
    const completedDate = completeProgress?.[0] && DateTime.fromISO(completeProgress[0].questProgress?.endDate as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
    let showOverlay = false
    let showQuest = true
    let overlayText = ''
    const overlaySubTexts = []
    if(quest.repeatable === false && completeProgress.length === 1){
      showOverlay = true
      overlayText = `One-Time Quest`
      overlaySubTexts.push(<div>
        Completed {completedDate}
      </div>)
      showQuest = !showOneTimeCompletedQuests ? false : true
    } else if(characterQuestProgress?.questProgress){
      if(characterQuestProgress.questProgress.status === 'in-progress' && characterQuestProgress.questProgress.questId !== quest.id){
        showOverlay = true
        overlayText = 'QUESTING'
        overlaySubTexts.push(<div>
          Already on the quest "{characterQuestProgress.quest.title}".
        </div>)
      }
    } else if(character?.level){
      const questLevelReq = quest.startRequirements.find(sr => sr.level)
      if(questLevelReq?.level){
        if(character.level < questLevelReq.level){
          showOverlay = true
          overlayText = 'REQUIRES'
          overlaySubTexts.push(<div>
            Level {questLevelReq.level}
          </div>)
        }
      }
    }

    let subText
    if(overlaySubTexts.length > 0){
      subText = <div>
        {overlaySubTexts.map(st => {
          return st
        })}
      </div>
    }

    if(!showQuest || (canTake === false && showIneligibleQuests === false)){
      return null
    }

    return <div id={`${quest.id === QUEST_INTRO_IDS.ADVENTURERS_GUILD_ID ? 'tutorial-quest-complete' : quest.id}`} onMouseEnter={() => {setHideBlur(true)}} onMouseLeave={() => {setHideBlur(false)}}>
      <StateOverlay active={hideBlur === false && showOverlay} text={overlayText} subText={subText}>
        <div  className={`${questItemClassName} ${thisQuestCharacterProgress?.canCompleteQuest === true ? 'complete' : ''}`}>
          {showButtons === true && <div className='quest-actions'>
            {canTake === true && <button 
              className={`success`}
              onClick={async () => {
                await handleAddQuest?.(quest, character?.id as string)
              }}
              >
              Take
            </button>}
            {thisQuestCharacterProgress?.questProgress?.status === 'in-progress' && thisQuestCharacterProgress.canCompleteQuest === false && <button 
                className={`danger`}
                onClick={async () => {
                  await handleAbandonQuest?.(thisQuestCharacterProgress?.questProgress?.id as string)
                }}
              >
              Abandon
            </button>}
            {thisQuestCharacterProgress?.questProgress?.status === 'in-progress' && thisQuestCharacterProgress.canCompleteQuest === true && <button 
                className={`success`}
                onClick={async () => {
                  await handleCompleteQuest?.(thisQuestCharacterProgress)
                }}
              >
              Complete
            </button>}
             {statusContent && <div
                className={`quest-status ${statusContent}`}
              >
                {thisQuestCharacterProgress?.questProgress?.status}
              </div>}
          </div>}
          
          <div className='quest-item-header'>
            {quest?.title}
          </div>

          <div className='quest-item-date'>
            {quest?.repeatable === true ? 'repeatable' : 'one-time quest'}
          </div>

          {thisQuestCharacterProgress && <div>
            {thisQuestCharacterProgress.questProgress?.startDate && <div className='quest-item-date'>
              <div>Started on {DateTime.fromISO(thisQuestCharacterProgress.questProgress?.startDate as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>
            </div>}
            {quest.repeatable === false && completeProgress.length > 0 && completeProgress[0].questProgress?.endDate && <div className='quest-item-date'>
              <div>Completed on {DateTime.fromISO(completeProgress[0].questProgress?.endDate as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>
            </div>}
            
          </div>}

          <div className='quest-item-description'>
            {quest?.description}
          </div>
          
          <div className='quest-sections'>
            <div>
              <div className={`quest-item-requirements-header ${
                quest?.startRequirements?.filter(req => req.completed === true).length === quest?.startRequirements.length ? 'success'
                  : ''
              }`}>
                {quest?.startRequirements?.filter(req => req.completed === true)?.length ?? 0} / {quest?.startRequirements?.length ?? 0} Take Requirements</div>
              <div className='quest-item-requirements-list'>
                {quest?.startRequirements?.map(r => {
                  const requiredAchievement = achievements?.find(a => a?.id === r.achievementId)
                  const requiredItem = items?.find(i => i?.id === r.itemId)
                  const requiredQuest = allQuestsWithProgress?.find(qwp => qwp.quest.id === r.questId)
                  const txns = thisQuestCharacterProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId) ?? []
                  let txnTotal = 0
                  for(const txn of txns){
                    txnTotal += txn.quantity
                  }
                  return <div className={r.completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
                    <div >
                      {!r.stats && <div style={{float: 'left'}}>
                        {r.completed === true ? '✔' : '✘'}
                      </div>}
                      {r.level && <>Level <strong >{r.level}</strong></>}
                      {r.questId && <div title={requiredQuest?.quest?.description}>Quest: <strong>{requiredQuest?.quest?.title}</strong></div>}
                      {r.achievementId && <div title={requiredAchievement?.description}>Achivement: <strong>{requiredAchievement?.title}</strong></div>}
                      {r.itemId && r.itemAmount && <><strong>{txnTotal > r.itemAmount ? r.itemAmount : txnTotal}/{r.itemAmount} {requiredItem?.name}</strong></>}
                      {r.stats && <> 
                        {Object.getOwnPropertyNames(r.stats).map(propertyName => {
                          //@ts-ignore
                          const name = r.stats[propertyName].name
                          //@ts-ignore
                          const value = r.stats[propertyName].value
                          if(value === 0) return null
                          return <div>
                            {r.completed === true ? '✔' : '✘'} {name}: <strong>{value}</strong>
                          </div>
                        })}
                      </>}
                    </div>
                  </div>
                })}
              </div>
            </div>
                
            <div>
              <div className={`quest-item-requirements-header ${quest?.completionRequirements?.filter(req => req.completed === true)?.length === quest.completionRequirements?.length ? 'success' : ''}`}>
                {quest?.completionRequirements?.filter(req => req.completed === true)?.length ?? 0} / {quest?.completionRequirements?.length ?? 0} Completed Requirements
              </div>
              <div className='quest-item-requirements-list'>
                
                {quest?.completionRequirements?.map(r => {
                  const achievement = achievements?.find(a => a?.id === r.achievementId)
                  const item = items?.find(i => i?.id === r.itemId)
                  const txns = thisQuestCharacterProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId) ?? []
                  let txnTotal = 0
                  for(const txn of txns){
                    txnTotal += txn.quantity
                  }
                  return <CharacterQuestRequirement 
                    started={thisQuestCharacterProgress?.questProgress?.status === 'in-progress'}
                    completed={r.completed === true}
                    achievement={achievement}
                    characterItemTotal={txnTotal}
                    item={item}
                    questItemTotal={r.itemAmount}
                    timeMinutes={r.timeMinutes}
                    startDate={characterQuestProgress?.questProgress?.startDate}
                  />                
                })}
              </div>
            </div>

            <div>
              <div className='quest-item-requirements-header success'>Rewards</div>
              <div className='quest-item-requirements-list'>
                {quest.rewards.map(r => {
                  const item = items?.find(i => i?.id === r.itemId)
                  return <div className='quest-reward'>
                    <div>
                      {r.xp && <>XP: <strong>{r.xp.toLocaleString()}</strong></>}
                      {r.itemId && r.itemAmount && <>{item?.name}: <strong>{r.itemAmount}</strong></>}

                    </div>
                  </div>
                })}
              </div>
            </div>

            <div>
              <div className='quest-item-date'>
                {completeProgress?.length} completed.
              </div>
            </div>
          </div>
        </div>
      </StateOverlay>
    </div>
}