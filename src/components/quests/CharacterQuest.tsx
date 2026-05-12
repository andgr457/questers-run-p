import { DateTime } from 'luxon'
import CharacterQuestRequirement from './CharacterQuestRequirement'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Quest } from '../../interfaces/quests/Quests.types'

interface CharacterQuestProps extends AppProperties {
  handleShowPopup: (popupType: 'quest' | 'quest-group', relatedId: string) => void
  showActions?: boolean
  quest: Quest
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
      questItemClassName = 'quest-item'
    } = props
    const characterAllProgress = allQuestsWithProgress?.filter(q => q.questProgress?.characterId === character?.id)
    const characterQuestAllProgress = characterAllProgress?.filter(q => q.questProgress?.questId === quest?.id)
    const completeProgress = characterQuestAllProgress?.filter(q => q.questProgress?.status === 'complete') ?? []
    const pendingProgress = characterQuestAllProgress?.filter(q => q.questProgress?.status === 'in-progress') ?? []
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

    const completedCompletionRequirements = thisQuestCharacterProgress?.quest.completionRequirements.filter(cr => cr.completed === true)
    const completedStartedRequirements = thisQuestCharacterProgress?.quest.startRequirements.filter(cr => cr.completed === true)

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

    return <div  className={questItemClassName}>
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
        
      </div>}
      {statusContent && <div
        className={`quest-status ${statusContent}`}
      >
        {characterQuestProgress?.questProgress?.status}
      </div>}

      <div className='quest-item-header'>
        {quest?.title}
      </div>

      <div className='quest-item-date'>
        {quest?.repeatable === true ? 'repeatable' : 'one-time quest'}
      </div>

      {characterQuestProgress && <div>
        {characterQuestProgress.questProgress?.startDate && <div className='quest-item-date'>
          <div>Started on {DateTime.fromISO(characterQuestProgress.questProgress?.startDate as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>
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
            completedStartedRequirements?.length === quest?.startRequirements.length ? 'success'
              : ''
          }`}>
            Start Requirements {completedStartedRequirements?.length ?? 0} / {quest?.startRequirements?.length ?? 0}</div>
          <div className='quest-item-requirements-list'>
            {quest?.startRequirements?.map(r => {
              const achievement = achievements?.find(a => a?.id === r.achievementId)
              const item = items?.find(i => i?.id === r.itemId)
              const txns = characterQuestProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId) ?? []
              let txnTotal = 0
              for(const txn of txns){
                txnTotal += txn.quantity
              }
              return <div className={r.completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
                <div className=''>
                  <div >
                    <div style={{float: 'left'}}>
                      {r.completed === true ? '✔' : '✘'}
                    </div>
                    {r.level && <>Level <strong >{r.level}</strong></>}
                    {r.questId && <div title={quest?.description}>Quest: <strong>{quest?.title}</strong></div>}
                    {r.achievementId && <div title={achievement?.description}>Achivement: <strong>{achievement?.title}</strong></div>}
                    {r.itemId && r.itemAmount && <><strong>{txnTotal > r.itemAmount ? r.itemAmount : txnTotal}/{r.itemAmount} {item?.name}</strong></>}
                    {r.stats && <> Required Stats
                      {Object.getOwnPropertyNames(r.stats).map(propertyName => {
                        //@ts-ignore
                        const name = r.stats[propertyName].name
                        //@ts-ignore
                        const value = r.stats[propertyName].value
                        if(value === 0) return null
                        return <div>
                          {name}: {value}
                        </div>
                      })}
                    </>}
                  </div>
                </div>              
              </div>
            })}
          </div>
        </div>
            
        <div>
          <div className={`quest-item-requirements-header ${completedCompletionRequirements?.length === quest.completionRequirements?.length ? 'success' : ''}`}>
            Completion Requirements {completedCompletionRequirements?.length ?? 0} / {quest?.completionRequirements?.length ?? 0}
          </div>
          <div className='quest-item-requirements-list'>
            
            {quest?.completionRequirements?.map(r => {
              const achievement = achievements?.find(a => a?.id === r.achievementId)
              const item = items?.find(i => i?.id === r.itemId)
              const txns = characterQuestProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId) ?? []
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
}