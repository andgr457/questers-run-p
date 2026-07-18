import { useEffect, useState, type RefObject } from 'react'
import styles from './GamePanel.module.css'
import { eventBus } from '../../engine/event/EventBus'

interface Props {
  title: string
  currentScreenName: string
  showBackground?: boolean
  scrollTopRef?: RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

export default function GamePanel(props: Props) {
  const {
    children,
    title,
    currentScreenName,
    showBackground = true
  } = props

  const [show, setShow] = useState<'' | 'in' | 'show' | 'out'>('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow('in')
    }, 50)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    
    const unsub = eventBus.subscribe(event => {
      if(event.type !== 'world:mode:changing') return
      if(event.meta?.worldModePrevious && event.meta?.worldMode){
        if(event.meta.worldModePrevious !== event.meta.worldMode){
          setShow('out')
        }
      }
    })

    return unsub
  }, [])
  return <div className={
    `${styles.wrapper} ${show === 'in' ? styles.in : show === 'out' ? styles.out : ''} ${showBackground === true ? styles.showBackground : ''}`}>
   {title && <div className='game-panel-title'>
      <div className='game-panel-title-main'>
        {title}
      </div>
      {currentScreenName && <div className='game-panel-title-current-screen'>
        {currentScreenName}
      </div>}
    </div>}

    <div className={`game-panel-children `}>
      {children}
    </div>

  </div>
}
