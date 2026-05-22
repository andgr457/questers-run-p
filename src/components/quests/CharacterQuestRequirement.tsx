import { DateTime } from 'luxon'
import type { Achievement } from '../../interfaces/achievements/Achievement.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { Mob } from '../../interfaces/mobs/Mob.types'
import { useNavigate } from 'react-router-dom'

interface CharacterQuestRequirementProps {
  started: boolean
  completed: boolean
  timeMinutes?: number
  achievement?: Achievement
  startDate?: string
  item?: Item
  questItemTotal?: number
  characterItemTotal?: number
  mob?: Mob
  characterMobTotal?: number
  questMobTotal?: number
}

export default function CharacterQuestRequirement(props: CharacterQuestRequirementProps){
  const {
    started,
    completed,
    item,
    timeMinutes,
    achievement,
    startDate,
    mob,
    characterMobTotal = 0,
    questMobTotal = 0,
    questItemTotal = 0,
    characterItemTotal = 0
  } = props

  const navigate = useNavigate()

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
  if(mob){
    if(characterMobTotal && questMobTotal){
      progressInfo = ''
      progressPercent = Math.min(100, (characterMobTotal / questMobTotal) * 100)
    }
  }

  const professionClickFn = item?.profession?.type ? () => {
    navigate(`/profession/${item.profession?.type}`)
  } : () => {}
  const mobClickFn = mob ? () => {
    navigate(`/hunting/${mob.location}`)
  } : () => {}

  const checkOrX = completed === true ? '✔' : '✘'

  return <div  className={completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
    <div>
      {timeMinutes && <>{checkOrX} <strong>{timeMinutes}</strong> minute(s) Long {progressInfo}</>}
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
      {achievement?.id && <div title={achievement?.description}>{checkOrX} Achivement: <strong>{achievement?.title}</strong></div>}
      {item && <div className='quest-completion-req'>
        <div>
          {checkOrX}
        </div>
        <div className='quest-completion-req-amounts'>
          {characterItemTotal} / {questItemTotal}
        </div>
        <div className='quest-completion-req-name'>
          {item?.name}
        </div>
        <div className='quest-completion-req-nav-btn'>
          <button className='button-requirement-nav' onClick={professionClickFn}>{item.profession?.type}</button>
        </div>
      </div>}
      {mob && <div className='quest-completion-req'>
        <div>
          {checkOrX}
        </div>
        <div className='quest-completion-req-amounts'>
          {characterMobTotal} / {questMobTotal}
        </div>
        <div className='quest-completion-req-name'>
          {mob?.name}
        </div>
        <div className='quest-completion-req-nav-btn'>
          <button className='button-requirement-nav' onClick={mobClickFn}>{mob.location} hunt</button>
        </div>
      </div>}
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