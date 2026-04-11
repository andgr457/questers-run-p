import { DateTime } from 'luxon'
import type { QuestWithQuestProgress } from './CharacterQuests'

interface CharacterQuestProps {
  questWithProgress: QuestWithQuestProgress
}

export default function CharacterQuest(props: CharacterQuestProps){
    const {
      questWithProgress
    } = props

    const status = questWithProgress.questProgress?.status
    const dateToShow = status === 'in-progress' ? questWithProgress.questProgress?.startDate : questWithProgress.questProgress?.endDate
    const startDate = DateTime.fromISO(dateToShow as string)
    const startDateDiffNow = Math.abs(startDate.diffNow('minutes').minutes)
    return <div className={
      questWithProgress.canTakeQuest === true ? 
        'quest-item cantake' : status === 'in-progress' ? 'quest-item inprogress' : status === 'complete' ? 'quest-item complete' : 'quest-item'}>
      <div className='quest-item-header'>
        {questWithProgress.quest.title} Lvl {questWithProgress.quest.requiredLevel}
      </div>
      <div className='quest-item-description'>
        "{questWithProgress.quest.description}"
      </div>
      <div className='quest-item-description flex-wrap gap-1'>
        <div className={`${questWithProgress.questProgress?.status === 'in-progress' ? 'status inprogress' : 
            questWithProgress.questProgress?.status === 'complete' ? 'status completed' : 
            'status'}`}>
          {questWithProgress.questProgress?.status ?? 'not-started'}
        </div>
      </div>
      <div>
        <div className='quest-item-requirements-header'>Requirements</div>
        <div className='quest-item-requirements-list'>
          {questWithProgress?.quest?.requirements.map(r => {
            return <div className='quest-item-requirements-item'>
              {r.timeMinutes && <>Minutes: {r.timeMinutes}</>}
              {r.achievementId && <>Achivement: {r.achievementId}</>}
              {r.itemId && <>Item: {r.itemId}</>}
              {r.itemAmount && <>Item Amount: {r.itemAmount}</>}

            </div>
          })}
        </div>
      </div>
      {questWithProgress?.questProgress && <div>
        
        <div className='quest-item-date'>
          Started {DateTime.fromISO(dateToShow as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
        </div>
        <div className='quest-item-date'>
          Quest Time: {questWithProgress.quest.cooldownMinutes}
          {!questWithProgress?.questProgress?.endDate && <>{startDateDiffNow.toFixed(1)} minutes left.</>}
          End {questWithProgress.questProgress?.endDate && DateTime.fromISO(questWithProgress.questProgress?.endDate as string).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
        </div>
        
      </div>}
    </div>
}