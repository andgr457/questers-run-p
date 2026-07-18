import { useEffect, useState } from 'react'
import type { ItemActions } from '../item-action/types/ItemAction.types'

interface Props<T> {
  entity: T
  actions: ItemActions<T>
  getEntityContent: (entity: T) => React.ReactNode
  onCardClick?: (entity: T) => void
}

export default function GameListItem<T>(props: Props<T>) {
  const {
    entity,
    onCardClick,
    actions,
    getEntityContent,
  } = props
  const content = getEntityContent(entity)

  const [show, setShow] = useState(false)
  useEffect(() => {
    if(show) return
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  let handleCardClick = onCardClick
  if(actions && actions.length > 0){
    handleCardClick = undefined
  }
  if(!onCardClick){
    handleCardClick = undefined
  }

  return (
    <div
      onClick={() => {
        if(handleCardClick){
          handleCardClick?.(entity)
        }
      }}
      className={`game-list-item ${handleCardClick ? 'pointer' : ''}  show`}
    >
      <div className='game-list-item-content'>
        {content}
      </div>

      {actions && actions.length > 0 && <div className='game-list-item-actions'>
        {actions.map(action => {
          if(!action.fn) return null
          return <div className='game-list-item-action'>
            <button
              className="button dark"
              onClick={() => {
                if(action.fn){
                  action.fn(entity)
                }
              }}
            >
              {action.getName ? action.getName?.(entity) : action.name}
            </button>
          </div>
        })}
      </div>}

    </div>
  )
}