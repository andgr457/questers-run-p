import { DateTime } from 'luxon'
import CustomContainerItem from '../CustomContainerItem'
import CharacterQuestRequirement from './CharacterQuestRequirement'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Quest } from '../../interfaces/quests/Quests.types'
import type { QuestWithQuestProgress } from './CharacterQuests'

interface CharacterQuestProps extends AppProperties {
  handleShowPopup: (popupType: 'quest' | 'quest-group', relatedId: string) => void
  showActions?: boolean
  quest: Quest
}

export default function CharacterQuest(props: CharacterQuestProps){
    const {
      characterQuestProgress: progress,
      showActions,
      quest
    } = props
    let characterQuestProgress = undefined
    if(progress?.quest?.id === quest?.id ){
      characterQuestProgress = progress
    }
    const status = characterQuestProgress?.questProgress?.status
    const dateToShow = status === 'in-progress' ? characterQuestProgress?.questProgress?.startDate : characterQuestProgress?.questProgress?.endDate
    const startDate = DateTime.fromISO(dateToShow as string)
    const completedCompletionRequirements = characterQuestProgress?.quest.completionRequirements.filter(cr => cr.completed === true)
    const completedStartedRequirements = characterQuestProgress?.quest.startRequirements.filter(cr => cr.completed === true)

    let borderStatus = characterQuestProgress?.canTakeQuest === true ? 
      '' : status === 'in-progress' ? 
      'warn-no-anim' : status === 'complete' ? 
      'success' : ''

    const showButtons = typeof showActions === 'undefined' || showActions === true
    
    return <div className='quest-item' onClick={() => {props?.handleShowPopup('quest', quest?.id as string)}}>
      <CustomContainerItem borderStatus={borderStatus}>
        {showButtons === true && <div className='quest-actions'>
          {!characterQuestProgress?.questProgress?.status && characterQuestProgress?.canTakeQuest === true && <button 
            className={characterQuestProgress?.canTakeQuest ? 'confirm' : 'disabled'}
            >
            Start Quest
          </button>}

          {characterQuestProgress?.canCompleteQuest === true && <button className='success'>
            Complete Quest
          </button>}

          {characterQuestProgress?.questProgress?.status === 'in-progress' && <>
            <button className={'danger'} >
              Abandon Quest
            </button>
          </>}
        </div>}

        <div className='quest-item-header'>
          {quest?.title}
          
        </div>

        <div
          className={`quest-status ${
            characterQuestProgress?.questProgress?.status === 'in-progress'
              ? 'inprogress'
              : characterQuestProgress?.questProgress?.status === 'complete'
              ? 'completed'
              : ''
          }`}
        >
          {characterQuestProgress?.questProgress?.status ?? 'not-started'}
        </div>

        <div className='quest-item-date'>
          {quest?.repeatable === true ? 'repeatable' : 'one-time quest'}
        </div>

        <div className='quest-item-date'>
          {startDate.isValid && <div>Started on {startDate.toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>}
        </div>

        <div>
          <div className='quest-item-description'>
            {quest?.description}
          </div>
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
                const achievement = characterQuestProgress?.questRequirementsAchievements?.find(a => a?.id === r.achievementId)
                const item = characterQuestProgress?.questRequirementsItems?.find(i => i?.id === r.itemId)
                const quest = characterQuestProgress?.questRequirementsQuests?.find(q => q.id === r.questId)
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
                return <CharacterQuestRequirement 
                  questWithProgress={characterQuestProgress as QuestWithQuestProgress}
                  requirement={r}
                />
              })}
            </div>
          </div>

          <div>
            <div className='quest-item-requirements-header success'>Rewards</div>
            <div className='quest-item-requirements-list'>
              {characterQuestProgress?.quest.rewards.map(r => {
                const item = characterQuestProgress?.questRequirementsItems.find(i => i.id === r.itemId)
                return <div>
                  <div>
                    {r.xp && <>XP: <strong>{r.xp.toLocaleString()}</strong></>}
                    {r.itemId && r.itemAmount && <>{item?.name}: <strong>{r.itemAmount}</strong></>}

                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        <div>
        </div>

      </CustomContainerItem>
    </div>
}