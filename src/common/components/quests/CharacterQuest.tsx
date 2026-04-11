import { DateTime } from 'luxon'
import type { QuestWithQuestProgress } from './CharacterQuests'
import type { Character } from '../../../interfaces/characters/Character.types'

interface CharacterQuestProps {
  questWithProgress: QuestWithQuestProgress
  character: Character
}

export default function CharacterQuest(props: CharacterQuestProps){
    const {
      questWithProgress,
      character
    } = props

    const status = questWithProgress.questProgress?.status
    const dateToShow = status === 'in-progress' ? questWithProgress.questProgress?.startDate : questWithProgress.questProgress?.endDate
    const startDate = DateTime.fromISO(dateToShow as string)
    
    return <div className={
      questWithProgress.canTakeQuest === true ? 
        'quest-item cantake' : status === 'in-progress' ? 'quest-item inprogress' : status === 'complete' ? 'quest-item complete' : 'quest-item'}>
      <div className='quest-item-header'>
        {questWithProgress.quest.title}
      </div>
      <div className='quest-item-description flex-wrap gap-1'>
        <div className={`${questWithProgress.questProgress?.status === 'in-progress' ? 'status inprogress' : 
            questWithProgress.questProgress?.status === 'complete' ? 'status completed' : 
            'status'}`}>
          {questWithProgress.questProgress?.status ?? 'not-started'}
        </div>
      </div>
      <div className='quest-item-description'>
        "{questWithProgress.quest.description}"
      </div>
      <div className='quest-item-date'>
        {startDate.isValid && <div>Started on {startDate.toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>}
      </div>
      <div>
        <div className='quest-item-requirements-header'>Start Requirements</div>
        <div>
          {questWithProgress?.quest?.startRequirements?.map(r => {
            const achievement = questWithProgress?.questRequirementsAchievements?.find(a => a?.id === r.achievementId)
            const item = questWithProgress?.questRequirementsItems?.find(i => i?.id === r.itemId)
            const quest = questWithProgress?.questRequirementsQuests?.find(q => q.id === r.questId)
            return <div className={'quest-item-requirements-item'}>
              <div className='flex-wrap gap-2'>
                <div>
                  {r.level && <>Level <strong>{r.level}</strong></>}
                  {r.questId && <>Quest: <strong>{quest?.title}</strong><br/>"{quest?.description}"</>}
                  {r.achievementId && <>Achivement: <strong>{achievement?.title}</strong><br/>"{achievement?.description}"</>}
                  {r.itemId && <><strong>{r.itemAmount} {item?.name}</strong></>}
                  {r.stats && <>
                    {Object.getOwnPropertyNames(r.stats).map(propertyName => {
                      //@ts-ignore
                      const name = r.stats[propertyName].name
                      //@ts-ignore
                      const value = r.stats[propertyName].value
                      return <div>
                        {name}: {value}
                      </div>
                    })}
                  </>}
                </div>
                <div>
                  <code>{r.completed === true ? 'complete' : 'pending'}</code>
                </div>
              </div>              
            </div>
          })}
        </div>
       
      </div>
      <div>
        <div className='quest-item-requirements-header'>Completion Requirements</div>
        <div className='quest-item-requirements-list'>
          
          {questWithProgress?.quest?.completionRequirements?.map(r => {
            const achievement = questWithProgress?.questRequirementsAchievements?.find(a => a?.id === r.achievementId)
            const item = questWithProgress?.questRequirementsItems?.find(i => i?.id === r.itemId)
            return <div className={r.completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
              <div className='flex-wrap gap-1'>
                <div>
                  {r.timeMinutes && <><strong>{r.timeMinutes}</strong> Minute(s) Long</>}
                  {r.achievementId && <>Achivement: <strong>{achievement?.title}</strong><br/>"{achievement?.description}"</>}
                  {r.itemId && <><strong>{r.itemAmount} {item?.name}</strong></>}
                </div>
                <div>
                  <code>{r.completed === true ? 'complete' : 'pending'}</code>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
}