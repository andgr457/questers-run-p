import { useState, useEffect } from 'react'
import GameListItem from './GameListItem'
import type { ItemActions } from '../item-action/types/ItemAction.types'

interface Props<T> {
  entities: T[]
  actions: ItemActions<T>
  getEntityContent: (entity: T) => React.ReactNode
  onCardClick?: (entity: T) => void
}

export default function GameList<T>(props: Props<T>) {
  const {
    entities,
    actions,
    getEntityContent,
    onCardClick
  } = props
  const [show, setShow] = useState(false)
  useEffect(() => {
    if(show) return
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])
  return (
    <div className={`game-list ${show === true ? 'show' : ''}`}>
      {entities.map(entity => (
        <GameListItem 
          actions={actions}
          entity={entity}
          getEntityContent={getEntityContent}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}