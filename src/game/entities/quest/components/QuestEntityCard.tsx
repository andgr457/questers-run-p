import type { QuestEntity } from '../types/QuestEntity.types'
import type { QuestGroupEntity } from '../types/QuestGroupEntity.types'

interface Props {
  quest: QuestEntity
  questGroup: QuestGroupEntity
}

export default function QuestEntityCard(props: Props){
  const {
    quest,
    questGroup,
  } = props

  if(!quest || !questGroup) return null
  
  return <>
    <div className='game-list-item-title'>
      {quest.title}
    </div>

    <div className='game-list-item-label'>
      {questGroup.title}
    </div>

    <div className='game-list-item-label'>
      {quest.description}
    </div>

    <div className='game-list-item-label'>
      {quest.repeatable ? 'Repeatable' : 'One-Time'}
    </div>

    <div className='game-list-item-header'>
      Requirements
    </div>
    <div className='game-list-item-label'>
      {quest.requirements.start.map(req => {
        const reqDivs = []
        for(const propName of Object.getOwnPropertyNames(req)){
          if(propName === 'title') continue
          //@ts-ignore
          let value = req[propName]
          
          reqDivs.push(<div className='game-list-item-capitolized'>
            <span >{req.title}</span>: {`${value}`}
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
          reqDivs.push(<div className='game-list-item-capitolized'>
            {req.title}: <span style={{textTransform: 'lowercase'}}>{`${value}`}</span>
          </div>)
        }
        return <div>
          {reqDivs}
        </div>
      })}
    </div>
    <div className='game-list-item-header'>
      Rewards
    </div>
    <div className='game-list-item-label'>
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
  </>
}