import type { GroupEventItem } from '../../types/DebugEvents.types'

interface Props {
  entity: GroupEventItem
}

export default function DebugEventListItem(props: Props){
  const {
    entity
  } = props

  return <>
    <div className='game-list-item-title'>
      {entity.title}
    </div>
    <div style={{width: '100%', textAlign: 'center'}}>
      <div className='game-code'>
        {entity.type}
      </div>
    </div>
    <div className='game-list-item-label'>
      {entity.description}
    </div>
  </>
}