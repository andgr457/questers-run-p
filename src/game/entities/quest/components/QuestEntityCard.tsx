import type { QuestEntity } from '../types/QuestEntity.types'
import type { QuestGroupEntity } from '../types/QuestGroupEntity.types'
import styles from './QuestEntityCard.module.css'

interface Props {
  quest: QuestEntity
  questGroup: QuestGroupEntity
}

export default function QuestEntityCard(props: Props){
  const {
    quest,
    questGroup,
  } = props

  
  return <div className={styles.card}>
    <div className={styles.items}>
      <div className={styles.item}>
        <div className={styles.itemName}>
          Title
        </div>
        <div className={styles.itemValue}>
          {quest.title}
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Description
        </div>
        <div className={styles.itemValue}>
          {quest.description}
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Quest Group
        </div>
        <div className={styles.itemValue}>
          {questGroup.title}
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Repeatable
        </div>
        <div className={styles.itemValue}>
          {quest.repeatable ? 'YES' : 'NO'}
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Start Requirements
        </div>
        <div className={styles.itemValue}>
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
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Complete Requirements
        </div>
        <div className={styles.itemValue}>
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
      </div>

      <div className={styles.item}>
        <div className={styles.itemName}>
          Rewards
        </div>
        <div className={styles.itemValue}>
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
    </div>
  </div>
}