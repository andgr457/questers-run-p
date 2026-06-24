import type { DebugEventsListItemUI } from '../../types/DebugEvents.types'

interface Props {
  entity: DebugEventsListItemUI
}

export default function DebugEventListActionItem(props: Props){
  const {
    entity
  } = props

  return <>
    <div className='game-list-item-title'>
      {entity.title}
    </div>
    <div className='game-list-item-label'>
      {entity.description}
    </div>
  </>
}