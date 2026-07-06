import { useEffect, useState } from 'react'
import type { ItemActions } from '../item-action/types/ItemAction.types'
import { ContextMenuIcon } from '../../game/context-menu/data/ContextMenuIcon.data'

interface Props<T> {
  title?: React.ReactNode
  description?: React.ReactNode
  actions: ItemActions<T>
  onBack?: () => void
  onBackLabel?: string
  expandable?: boolean
  children?: React.ReactNode
  actionsLocation?: 'top' | 'bottom'
}

export default function GamePanelSection<T>(props: Props<T>){
  const {
    actions,
    description,
    title,
    children,
    expandable = true,
    onBack,
    onBackLabel,
    actionsLocation = 'top'
  } = props
  const [show, setShow] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  return <div className={`game-panel-section ${show === true ? 'show' : ''}`}>
    {actionsLocation === 'top' && onBack && <div className='game-panel-section-back' style={{width: '100%'}}>
      <button
        className='button'
        style={{width: '100%'}}
        onClick={onBack}
      >
        {ContextMenuIcon.back} Back {onBackLabel && ` to ${onBackLabel}`}
      </button>
    </div>}    
    {title && <div onClick={() => {
      if(expandable){
        setShowChildren(!showChildren)
      }
    }} className={`game-panel-section-title ${showChildren === true ? 'show' : ''}`}>
      {title}
    </div>}
    
      <div className='game-panel-section-actions'>
        {actions.map(action => {

          return <div className='game-panel-section-action'>
            <button
              onClick={() => {action.fn()}}
              className={action.className ?? 'button'}
            >
              {action.name}
            </button>
          </div>
        })}
        
      </div>
    <div className={`game-panel-section-children-wrapper ${showChildren ? 'show' : ''}`}>
      {description && <div className='game-panel-section-description'>
        {description}
      </div>}

      {children && <div className='game-panel-section-children'>
        {children}
      </div>}
    </div>
    {actionsLocation === 'bottom' && onBack && <div className='game-panel-section-back' style={{width: '100%'}}>
      <button
        className='button'
        style={{width: '100%'}}
        onClick={onBack}
      >
        {ContextMenuIcon.back} Back {onBackLabel && ` to ${onBackLabel}`}
      </button>
    </div>}  
  </div>
}