import { useEffect, useState } from 'react'
import ContextMenuButton from '../../game/context-menu/components/ContextMenuButton'

interface Props {
  title: string
  currentScreenName: string
  onBackTo?: () => void
  children: React.ReactNode
}

export default function GamePanel(props: Props) {

  const {
    children,
    title,
    currentScreenName,
    onBackTo
  } = props
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])
  return <div className='game-panel-wrapper'>
    {show === true && (
      title && <div className='game-panel-title'>
        <div className='game-panel-title-main'>
          {title}
        </div>
        {currentScreenName && <div className='game-panel-title-current-screen'>
          {currentScreenName}
        </div>}
        {onBackTo && <div className='game-panel-title-back-button'>
          <ContextMenuButton 
            action={{
              id: 'back-settings',
              label: 'Back',
              iconName: 'back',
              iconRotate: false,
              onClick: onBackTo ? () => {onBackTo?.()} : undefined as any,
            }}
          />
        </div>}
      </div>
    )}

    {show === true && (
      <div className={`game-panel-children ${show === true ? 'show' : ''}`}>
        {children}
      </div>
    )}

  </div>
}
