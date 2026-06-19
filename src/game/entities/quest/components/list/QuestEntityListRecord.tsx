import styles from './QuestEntityListRecord.module.css'

import type { QuestEntity } from '../../types/QuestEntity.types'
import type { QuestGroupEntity } from '../../types/QuestGroupEntity.types'

interface Props {
  quest: QuestEntity
  questGroup: QuestGroupEntity
  onSelect?: (quest: QuestEntity, questGroup: QuestGroupEntity) => void
  onView: (quest: QuestEntity, questGroup: QuestGroupEntity) => void
}

export default function QuestEntityListRecord(props: Props){
  const {
    onSelect,
    quest,
    questGroup,
    onView,
  } = props

  return <div className={styles.record} onClick={onSelect ? () => {} : () => {onView(quest, questGroup)}}>
    <div className={styles.title}>
      {quest.title}
    </div>
    <div className={styles.description}>
      {quest.description}
    </div>
    <div>
      <div>
        Requirements
      </div>
      {quest.requirements.start.map(req => {
        const reqDivs = []
        for(const propName of Object.getOwnPropertyNames(req)){
          if(propName === 'title') continue
          //@ts-ignore
          let value = req[propName]
          
          reqDivs.push(<div>
            <span className={styles.reqName}>{req.title}</span>: {`${value}`}
          </div>)
        }
        return <div>
          {reqDivs}
        </div>
      })}
      {quest.requirements.complete.map(req => {
        const reqDivs = []
        for(const propName of Object.getOwnPropertyNames(req)){
          if(propName === 'title') continue
          //@ts-ignore
          let value = req[propName]
          if(propName === 'timeMillis'){
            const seconds = value / 1000
            if(seconds > 60){
              const minutes = seconds / 60
              if(minutes > 60){
                const hours = minutes / 60
                value = `${hours} hour(s)`
              } else {
                value = `${minutes} minute(s)`
              }
            } else {
              value = `${seconds} second(s)`
            }
          }
          if(typeof value === 'number'){
            value = value.toFixed(1)
          }
          reqDivs.push(<div>
            {req.title}: {`${value}`}
          </div>)
        }
        return <div>
          {reqDivs}
        </div>
      })}
    </div>

    <div>
      <div>
        Rewards
      </div>
      <div>
        {quest.rewards.map(rew => {
          const rewDivs = []
          for(const propName of Object.getOwnPropertyNames(rew)){
            if(propName === 'title') continue
            //@ts-ignore
            let value = rew[propName]
            if(typeof value === 'number'){
              value = value.toFixed(0)
            }
            rewDivs.push(<div>
              {rew.title}: {`${value}`}
            </div>)
          }
          return <div>
            {rewDivs}
          </div>
        })}
      </div>
    </div>

    <div className={styles.buttons}>
      {onSelect && <button className='button-basic dark' onClick={() => {onSelect(quest, questGroup)}}>
        CHOOSE
      </button>}
      {onSelect && <button className='button-basic dark' onClick={() => {onView(quest, questGroup)}}>
        VIEW
      </button>}
    </div>
  </div>
}