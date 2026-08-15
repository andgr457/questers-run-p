import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../engine/events/EventBus'
import type { WorldModeMain } from '../../../engine/events/types/WorldModeEvents.types'
import styles from './TransitionOverlay.module.css'
import { useEffect, useState } from 'react'

type IntroMode = 'start' | 'wait' | 'complete'

interface Props {
  text: string
  onCompleteModeMainChangeTo?: WorldModeMain
}

export default function TransitionOverlay(props: Props) {
  const [mode, setMode] = useState<IntroMode>('start')
  const [showPanels, setShowPanels] = useState(false)
  const {
    text,
    onCompleteModeMainChangeTo = 'guild'
  } = props

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    if(mode === 'start'){
      requestAnimationFrame(() => {
        setShowPanels(true)
      })

      timer = setTimeout(() => {
        setMode('wait')
      }, 900)
    }

    if(mode === 'wait'){
      timer = setTimeout(() => {
        setMode('complete')
      }, 1400)
    }

    if(mode === 'complete'){
      setShowPanels(false)

      timer = setTimeout(() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:overlay:change',
          created: clockRuntimeService.getNow(),
          meta: {
            mode: 'none'
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
      }, 900)
    }

    return () => {
      if(timer) clearTimeout(timer)
    }
  }, [mode])

  const showText = mode === 'wait'

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.leftPanel} ${showPanels ? styles.show : styles.hide}`} />
      <div className={`${styles.rightPanel} ${showPanels ? styles.show : styles.hide}`} />

      <div className={`${styles.text} ${showText ? styles.show : styles.hide}`}>
        <span>{text}</span>
      </div>
    </div>
  )
}