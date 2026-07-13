import { useEffect, useState } from 'react'
import type { Transition } from './types/Transition.types'
import styles from './TransitionDetailInteractive.module.css'
import AnimatedText from '../text/animated-text/AnimatedText'
import { eventBus } from '../../engine/event/EventBus'
import { ContextMenuIcon } from '../../game/context-menu/data/ContextMenuIcon.data'
import LeftRightText from '../text/left-right-text/LeftRightText'

export interface TransitionDetailInteractiveProps {
  transition: Transition
  continueText?: string
  className?: string
  onComplete?: () => void
}

export default function TransitionDetailInteractive(props: TransitionDetailInteractiveProps) {
  const { 
    transition, 
    className, 
    onComplete,
    continueText = 'continue',
  } = props

  const leftRightMeta = transition.leftRightMeta
  const animatedMeta = transition.animatedMeta

  const [visible, setVisible] = useState(false)
  const [canComplete, setCanComplete] = useState(false)

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true)
    }, 50)

    return () => clearTimeout(enterTimer)
  }, [])

  return (
    <div
      className={[
        styles.wrapper,
        visible ? styles.show : '',
        className ?? ''
      ].join(' ')}
    >
      <div className={`${styles.container} unselectable`}>
        {transition.textType === 'animated' && animatedMeta && <div>          
          <AnimatedText
            text={animatedMeta.text}
            delay={animatedMeta.delay ?? 3000}
            onPrintingChange={(value) => {
              if (!value) {
                setCanComplete(true)
              }
            }}
          />
        </div>}
        {transition.textType === 'left-right' && leftRightMeta && <div>
          <LeftRightText 
            leftText={leftRightMeta.leftText}
            rightText={leftRightMeta.rightText}
            delayBetween={leftRightMeta.delayBetween}
            leftRightStyle={leftRightMeta.leftRightStyle}
            onComplete={() => {
              setCanComplete(true)
            }}
          />
        </div>}
        <div className={styles.continueWrapper}>
          <div 
            className={`${styles.continue} ${canComplete === true ? styles.show : ''}`}
            onClick={() => {
              setVisible(false)
              setTimeout(() => {
                onComplete?.()
                if(transition){
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'transition:stop',
                    meta: {
                      transition,
                    }
                  })
                  setVisible(true)
                }
              }, 1000)
            }}
          >
            <div>
              {continueText} 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}