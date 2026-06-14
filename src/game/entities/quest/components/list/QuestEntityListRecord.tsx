import styles from './QuestEntityListRecord.module.css'

import type { QuestEntity } from '../../types/QuestEntity.types'

interface Props {
  quest: QuestEntity
  onClick: (quest: QuestEntity) => void
}

export default function QuestEntityListRecord(props: Props){
  const {
    onClick,
    quest
  } = props
  return <div onClick={() => {onClick(quest)}}>
    <div>
      {quest.title}
    </div>
    <div>
      {quest.description}
    </div>
    <div>
      {quest.repeatable ? 'REPEATABLE' : 'ONE-TIME'}
    </div>
    
    <div>
      <div>
        START REQUIREMENTS
      </div>
      {quest.requirements.start.map(req => {
        const reqDivs = []
        for(const propName of Object.getOwnPropertyNames(req)){
          if(propName === 'title') continue
          const name = propName.toUpperCase()
          //@ts-ignore
          let value = req[propName]
          
          reqDivs.push(<div>
            {name}: {`${value}`}
          </div>)
        }
        return <div>
          {reqDivs}
        </div>
      })}
    </div>

    <div>
      <div>
        COMPLETE REQUIREMENTS
      </div>
      {quest.requirements.complete.map(req => {
        const reqDivs = []
        for(const propName of Object.getOwnPropertyNames(req)){
          if(propName === 'title') continue
          const name = propName.toUpperCase()
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
          reqDivs.push(<div>
            {req.title}: {`${value}`}
          </div>)
        }
        return <div>
          {reqDivs}
        </div>
      })}
    </div>
  </div>
}