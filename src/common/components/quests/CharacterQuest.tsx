import { DateTime } from 'luxon'
import type { QuestWithQuestProgress } from './CharacterQuests'
import CustomContainerItem from '../CustomContainerItem'

interface CharacterQuestProps {
  questWithProgress: QuestWithQuestProgress
  handleShowPopup: (popupType: 'quest' | 'quest-group', relatedId: string) => void
}

export default function CharacterQuest(props: CharacterQuestProps){
    const {
      questWithProgress
    } = props
    const status = questWithProgress.questProgress?.status
    const dateToShow = status === 'in-progress' ? questWithProgress.questProgress?.startDate : questWithProgress.questProgress?.endDate
    const startDate = DateTime.fromISO(dateToShow as string)
    const completedCompletionRequirements = questWithProgress.quest.completionRequirements.filter(cr => cr.completed === true)
    const completedStartedRequirements = questWithProgress.quest.startRequirements.filter(cr => cr.completed === true)

    let borderStatus = questWithProgress.canTakeQuest === true ? 
      '' : status === 'in-progress' ? 
      'warn' : status === 'complete' ? 
      'success' : ''

    return <div onClick={() => {props?.handleShowPopup('quest', questWithProgress.quest.id)}}>
      <CustomContainerItem borderStatus={borderStatus}>
        <div className='quest-item-header'>
          {questWithProgress.quest.title}
        </div>
        <div className='quest-item-date'>
          {startDate.isValid && <div>Started on {startDate.toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>}
        </div>
        <div className={`${questWithProgress.questProgress?.status === 'in-progress' ? 'status inprogress' : 
            questWithProgress.questProgress?.status === 'complete' ? 'status completed' : 
            'status'}`} style={{float: 'right'}}>
          {questWithProgress.questProgress?.status ?? 'not-started'}
        </div>
        <div className='flex-wrap gap-1'>
          {!questWithProgress.questProgress?.status && questWithProgress.canTakeQuest === true && <button 
            className={questWithProgress.canTakeQuest ? 'confirm' : 'disabled'}
            >
            Start Quest
          </button>}

          {questWithProgress.questProgress?.status === 'in-progress' && questWithProgress.canCompleteQuest === true && <>
            <button>
              Complete Quest
            </button>
            <button className={'danger'}>
              Abandon Quest
            </button>
          </>}
          
        </div>

        <div>
          <div className='quest-item-requirements-header'>Description</div>
          <div className='quest-item-description'>
            {questWithProgress.quest.description}
          </div>
        </div>
      
        <div className='flex-wrap gap-1'>
          <div>
            <div className='quest-item-requirements-header'>Start Requirements {completedStartedRequirements.length} / {questWithProgress.quest.startRequirements.length}</div>
            <div>
              {questWithProgress?.quest?.startRequirements?.map(r => {
                const achievement = questWithProgress?.questRequirementsAchievements?.find(a => a?.id === r.achievementId)
                const item = questWithProgress?.questRequirementsItems?.find(i => i?.id === r.itemId)
                const quest = questWithProgress?.questRequirementsQuests?.find(q => q.id === r.questId)
                const txns = questWithProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId)
                let txnTotal = 0
                for(const txn of txns){
                  txnTotal += txn.quantity
                }
                return <div className={'quest-item-requirements-item'}>
                  <div className=''>
                    <div>
                      <div style={{float: 'left'}}>
                        {r.completed === true ? '✔' : '✘'}
                      </div>
                      {r.level && <>Level <strong>{r.level}</strong></>}
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
            <div className='quest-item-requirements-header'>Completion Requirements {completedCompletionRequirements.length} / {questWithProgress.quest.completionRequirements.length}</div>
            <div className='quest-item-requirements-list'>
              
              {questWithProgress?.quest?.completionRequirements?.map(r => {
                const achievement = questWithProgress?.questRequirementsAchievements?.find(a => a?.id === r.achievementId)
                const item = questWithProgress?.questRequirementsItems?.find(i => i?.id === r.itemId)
                const txns = questWithProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === r.itemId)
                let txnTotal = 0
                for(const txn of txns){
                  txnTotal += txn.quantity
                }
                return <div className={r.completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
                  <div>
                    <div style={{float: 'left'}}>
                      {r.completed === true ? '✔' : '✘'}
                    </div>
                    {r.timeMinutes && <><strong>{r.timeMinutes}</strong> Minute(s) Long</>}
                    {r.achievementId && <div title={achievement?.description}>Achivement: <strong>{achievement?.title}</strong></div>}
                    {r.itemId && r.itemAmount && <><strong>{txnTotal > r.itemAmount ? r.itemAmount : txnTotal}/{r.itemAmount} {item?.name}</strong></>}
                  </div>
                </div>
              })}
            </div>
          </div>

          <div>
            <div className='quest-item-requirements-header'>Rewards</div>
            <div className='quest-item-requirements-list'>
              {questWithProgress.quest.rewards.map(r => {
                const item = questWithProgress.questRequirementsItems.find(i => i.id === r.itemId)
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