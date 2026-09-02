import { GAME_CREDITS_SFX_LOCAL_URLS } from '../../../data/credits/CreditsSFX.data'
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../engine/events/EventBus'
import type { WorldModeMain } from '../../../engine/events/types/WorldModeEvents.types'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import styles from './TransitionOverlay.module.css'
import { useEffect, useState } from 'react'

type IntroMode = 'start' | 'wait' | 'complete'

interface Props {
  text: string
  onCompleteModeMainChangeTo?: WorldModeMain
  waitForUserClick?: boolean
}

export default function TransitionOverlay(props: Props) {
  const [mode, setMode] = useState<IntroMode>('start')
  const [showPanels, setShowPanels] = useState(false)
  const {
    text,
    onCompleteModeMainChangeTo = 'town:map',
    waitForUserClick = true
  } = props
  const [userClicked, setUserClicked] = useState(false)

  const { 
    play
  } = useAudioPlayer({
    audioUrl: GAME_CREDITS_SFX_LOCAL_URLS.sfx_mixit_transition
  })
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    if(mode === 'start'){
      requestAnimationFrame(() => {
        setShowPanels(true)
      })

      timer = setTimeout(() => {
        setMode('wait')
      }, 300)
    }
    
    if(mode === 'wait'){
      if(waitForUserClick && userClicked === true){
        timer = setTimeout(() => {
          setMode('complete')
        }, 750)
      } else if(!waitForUserClick){
        timer = setTimeout(() => {
          setMode('complete')
        }, 750)
      }
    }

    if(mode === 'complete'){
      play()

      setShowPanels(false)

      timer = setTimeout(() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:overlay:change',
          created: clockRuntimeService.getNow(),
          meta: {
            mode: 'none',
            transitionOnCompleteMode: 'none',
            transitionText: ''
          }
        })

        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:main:change',
          created: clockRuntimeService.getNow(),
          meta: {
            mode: onCompleteModeMainChangeTo
          }
        })
      }, 750)
    }

    return () => {
      if(timer) clearTimeout(timer)
    }
  }, [mode, waitForUserClick, userClicked])

  const showText = mode === 'wait'

  return (
    <div 
      className={`${styles.wrapper} ${waitForUserClick ? styles.clickable : ''}`} 
      onClick={() => {
        setUserClicked(true)
      }}
    >
      <div className={`${styles.leftPanel} ${showPanels ? styles.show : styles.hide}`} />
      <div className={`${styles.rightPanel} ${showPanels ? styles.show : styles.hide}`} />

      <div className={styles.textWrapper}>

      <div className={`${styles.text} ${showText ? styles.show : styles.hide}`}>
        <span>{text}</span>
      </div>
      {waitForUserClick && (
        <div 
          className={`${styles.continue} ${userClicked ? styles.hide : showText ? styles.show : styles.hide}`}
        >
          <span>Tap to Continue</span>
        </div>
      )}
      </div>
    </div>
  )
}