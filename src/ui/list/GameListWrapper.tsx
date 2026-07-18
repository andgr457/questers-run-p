import { useEffect, useState } from 'react';
import GameList from './GameList';
import type { ItemActions } from '../item-action/types/ItemAction.types';

interface Props<T> {
  title?: string
  entities: T[]
  actions: ItemActions<T>
  getEntityContent: (entity: T) => React.ReactNode
  onCardClick?: (entity: T) => void
}

export default function GameListWrapper<T>(props: Props<T>){
  const {
    actions,
    entities,
    getEntityContent,
    title,
    onCardClick,
  } = props

  const [show, setShow] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  useEffect(() => {
    if(show) return
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  return <div className={`game-list-wrapper ${show === true ? 'show' : ''}`}>
    {title && <div 
      onClick={() => setShowChildren(!showChildren)} 
      className={`game-list-wrapper-title ${showChildren ? 'show' : ''}`}>
      {title}
    </div>}
    <div className={`game-list-wrapper-list ${showChildren ? 'show' : ''}`}>
      <GameList
        actions={actions}
        entities={entities}
        getEntityContent={getEntityContent}
        onCardClick={onCardClick}
      />
    </div>
  </div>
}