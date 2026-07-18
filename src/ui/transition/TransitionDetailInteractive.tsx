import { useEffect, useState } from 'react'
import type { Transition } from './types/Transition.types'
import styles from './TransitionDetailInteractive.module.css'
import AnimatedText from '../text/animated-text/AnimatedText'
import { eventBus } from '../../engine/event/EventBus'
import LeftRightText from '../text/left-right-text/LeftRightText'
import TextWithColor from '../text/text-color/TextWithColor'
import { ContextMenuIcon } from '../../game/context-menu/data/ContextMenuIcon.data'

export interface TransitionDetailInteractiveProps {
  transition: Transition
  className?: string
  continueText?: string
  skippable?: boolean
  onComplete?: () => void
  onSkip?: () => void
}

export default function TransitionDetailInteractive(props: TransitionDetailInteractiveProps) {
  const { 
    transition, 
    onComplete,
    continueText = '',
    className = '',
    skippable = false,
    onSkip,
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

  useEffect(() => {
    if(continueText || !canComplete) return
    let exitTimer
    if(onComplete){
      exitTimer = setTimeout(() => {
        onComplete()
      }, transition.delay ?? 1500)
    }
    if(exitTimer) 
      return () => clearTimeout(exitTimer)
  }, [canComplete, continueText, onComplete,])

  return (
    <div
      onClick={() => {
        if(!canComplete && continueText){
          setCanComplete(true)
        }
      }}
      className={[
        styles.wrapper,
        visible ? styles.show : '',
      ].join(' ')}
    >
      <div className={`${styles.container} unselectable`}>
        {transition.textType === 'animated' && animatedMeta && <div
          className={`${className}`}
        >          
          <AnimatedText
            text={animatedMeta.text}
            textFancy={animatedMeta.textFancy}
            delay={canComplete ? 0 : animatedMeta.delay ?? 3000}
            onPrintingChange={(value) => {
              if (!value) {
                setCanComplete(true)
              }
            }}
          />
        </div>}
        {transition.textType === 'left-right' && leftRightMeta && <div
          className={`${className}`}
        >
          <LeftRightText 
            leftText={leftRightMeta.leftText}
            rightText={leftRightMeta.rightText}
            delayBetween={leftRightMeta.delayBetween}
            leftRightStyle={leftRightMeta.leftRightStyle}
            text={leftRightMeta.text}
            textFancy={leftRightMeta.textFancy}
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
              }, 1500)
            }}
          >
            <TextWithColor  text={continueText} pulse />
          </div>
          {skippable && (
            <div 
              className={`${styles.continue} ${canComplete === true ? styles.show : ''}`}
              title='Skip'
              onClick={() => {
                setVisible(false)
                setTimeout(() => {
                  onSkip?.()
                  if(transition){
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'transition:stop',
                      meta: {
                        transition,
                      }
                    })
                    // setVisible(true)
                  }
                }, 1500)
              }}
            >
              {ContextMenuIcon.fast_forward}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}