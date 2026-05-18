import { DateTime } from 'luxon'
import type { Achievement } from '../../interfaces/achievements/Achievement.types'
import type { Item } from '../../interfaces/items/Item.types'

interface CharacterQuestRequirementProps {
  started: boolean
  completed: boolean
  timeMinutes?: number
  achievement?: Achievement
  startDate?: string
  item?: Item
  questItemTotal?: number
  characterItemTotal?: number
}

export default function CharacterQuestRequirement(props: CharacterQuestRequirementProps){
  const {
    started,
    completed,
    item,
    timeMinutes,
    achievement,
    startDate,
    questItemTotal = 0,
    characterItemTotal = 0
  } = props

  let progressInfo = ''
  let progressPercent = 0
  if(timeMinutes && startDate){
    const leftDate = DateTime.fromISO(startDate)
    const elapsedMinutes = Math.abs(leftDate.diffNow('minutes').minutes)
    const leftMinutes = timeMinutes - elapsedMinutes
    if(leftMinutes < 0){
      progressInfo = ''
      progressPercent = 100
    } else {
      progressInfo = `| ${leftMinutes.toFixed(1)} minute(s) remaining.`
      progressPercent = Math.min(100, (elapsedMinutes / timeMinutes) * 100)

    }
  }
  if(item){
    if(characterItemTotal && questItemTotal){
      progressInfo = ``
      progressPercent = Math.min(100, (characterItemTotal / questItemTotal) * 100)
    }
  }
  
  return <div  className={completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
    <div>
      <div style={{float: 'left'}}>
        {completed === true ? '✔' : '✘'}&nbsp;
      </div>
      {timeMinutes && <><strong>{timeMinutes}</strong> minute(s) Long {progressInfo}</>}
      {started === true && completed === false && timeMinutes && <><div
        className={`
          character-stat-card-bar
          ${'attribute-bar'}
        `}
      >
        <div
          className={`
            character-stat-card-fill
            ${'attribute-fill'}
          `}
          style={{
            width: `${progressPercent}%`
          }}
        />
      </div></>}
      {achievement?.id && <div title={achievement?.description}>Achivement: <strong>{achievement?.title}</strong></div>}
      {item && <>{characterItemTotal} / {questItemTotal} <strong style={{fontSize: 'smaller'}}>{item?.name}</strong></>}
      {started === true && completed === false && item && <><div
        className={`
          character-stat-card-bar
          ${'attribute-bar'}
        `}
      >
        <div
          className={`
            character-stat-card-fill
            ${'attribute-fill'}
          `}
          style={{
            width: `${progressPercent}%`
          }}
        />
      </div></>}
    </div>
  </div>
}