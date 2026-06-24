import { useEffect, useState } from 'react'
import type { ItemActions } from '../item-action/types/ItemAction.types'
import { ContextMenuIcon } from '../../game/context-menu/data/ContextMenuIcon.data'

interface Props<T> {
  title: React.ReactNode
  description: React.ReactNode
  actions: ItemActions<T>
  onBack?: () => void
  onBackLabel?: string
  expandable?: boolean
  children?: React.ReactNode
}

export default function GamePanelSection<T>(props: Props<T>){
  const {
    actions,
    description,
    title,
    children,
    expandable = true,
    onBack,
    onBackLabel
  } = props
  const [show, setShow] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])

  return <div className={`game-panel-section ${show === true ? 'show' : ''}`}>
    {onBack && <div style={{textAlign: 'right', marginTop: '10px', marginBottom: '10px'}}>
      <button
        className='button gold'
        onClick={onBack}
      >
        {ContextMenuIcon.back} Back {onBackLabel && ` to ${onBackLabel}`}
      </button>
    </div>}    
    <div onClick={() => {
      if(expandable){
        setShowChildren(!showChildren)
      }
    }} className={`game-panel-section-title ${showChildren === true ? 'show' : ''}`}>
      {title}
    </div>
    <div className={`game-panel-section-children-wrapper ${showChildren ? 'show' : ''}`}>
      <div className='game-panel-section-description'>
        {description}
      </div>

      {children && <div className='game-panel-section-children'>
        {children}
      </div>}
      
      <div className='game-panel-section-actions'>
        {actions.map(action => {

          return <div className='game-panel-section-action'>
            <button
              onClick={() => {action.fn()}}
              className={action.className}
            >
              {action.name}
            </button>
          </div>
        })}
        
      </div>
      
    </div>
  </div>
}