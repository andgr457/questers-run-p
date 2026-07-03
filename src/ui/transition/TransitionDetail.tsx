import { useEffect, useState } from 'react'
import type { Transition } from './types/Transition.types'
import styles from './Transition.module.css'
import AnimatedText from '../text/animated-text/AnimatedText'
import { eventBus } from '../../engine/event/EventBus'
import { transitionRuntimeService } from '../../engine/transition/TransitionRuntimeService'

interface Props {
  transition: Transition
  className?: string
  onComplete?: () => void
}

export default function TransitionDetail(props: Props) {
  const { transition, className, onComplete } = props

  const [visible, setVisible] = useState(false)
  const [canComplete, setCanComplete] = useState(false)

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true)
    }, 50)

    return () => clearTimeout(enterTimer)
  }, [])

  useEffect(() => {
    if (!visible) return

    const minShowTimer = setTimeout(() => {
      setCanComplete(true)
    }, 800) // ensures it stays visible at least a bit

    return () => clearTimeout(minShowTimer)
  }, [visible])

  return (
    <div
      className={[
        styles.wrapper,
        visible ? styles.show : '',
        className ?? ''
      ].join(' ')}
    >
      <div className={styles.container}>
        <AnimatedText
          text={transition.title}
          delay={transition.delay ?? 3000}
          onPrintingChange={(value) => {
            if (!value && canComplete) {
              setVisible(false)

              setTimeout(() => {
                onComplete?.()
                if(transitionRuntimeService.getCurrentTransition()?.transition){
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'transition:stop'
                  })
                }
              }, 400)
            }
          }}
        />
      </div>
    </div>
  )
}