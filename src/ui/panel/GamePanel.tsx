import { useEffect, useState } from 'react'
import styles from './GamePanel.module.css'
import { eventBus } from '../../engine/event/EventBus'

interface Props {
  title: string
  currentScreenName: string
  showBackground?: boolean
  children: React.ReactNode
}

export default function GamePanel(props: Props) {
  const {
    children,
    title,
    currentScreenName,
    showBackground = true
  } = props

  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 250)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    
    const unsub = eventBus.subscribe(event => {
      if(event.type !== 'world:mode:changing') return
      if(event.meta?.worldModePrevious && event.meta?.worldMode){
        if(event.meta.worldModePrevious !== event.meta.worldMode){
          setShow(false)
        }
      }
    })

    return unsub
  }, [])
  return <div className={`${styles.wrapper} ${show === true ? styles.show : ''} ${showBackground === true ? styles.showBackground : ''}`}>
   {title && <div className='game-panel-title'>
      <div className='game-panel-title-main'>
        {title}
      </div>
      {currentScreenName && <div className='game-panel-title-current-screen'>
        {currentScreenName}
      </div>}
    </div>}

    <div className={`game-panel-children ${show === true ? 'show' : ''}`}>
      {children}
    </div>

  </div>
}
