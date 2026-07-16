import { useEffect, useState } from 'react'
import styles from './LeftRightText.module.css'

type LeftRightStyle =
  | 'both'
  | 'left-first'
  | 'right-first'

export interface LeftRightTextProps {
  leftText: string
  rightText: string
  leftRightStyle: LeftRightStyle
  text?: string
  textFancy?: React.ReactNode
  delayBetween?: number
  onComplete?: () => void
}

export default function LeftRightText(props: LeftRightTextProps) {
  const {
    leftText,
    rightText,
    leftRightStyle,
    delayBetween = 1000,
    onComplete,
    text,
    textFancy,
  } = props

  const [canStartLeft, setCanStartLeft] = useState(false)
  const [canStartRight, setCanStartRight] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setCanStartLeft(false)
    setCanStartRight(false)

    let timer: ReturnType<typeof setTimeout> | undefined

    switch (leftRightStyle) {
      case 'both':
        setCanStartLeft(true)
        setCanStartRight(true)
        break

      case 'left-first':
        setCanStartLeft(true)
        timer = setTimeout(() => {
          setCanStartRight(true)
        }, delayBetween)
        break

      case 'right-first':
        setCanStartRight(true)
        timer = setTimeout(() => {
          setCanStartLeft(true)
        }, delayBetween)
        break
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [leftText, rightText, leftRightStyle, delayBetween])

  useEffect(() => {
    if (!onComplete) return

    const total =
      leftRightStyle === 'both'
        ? 600
        : delayBetween + 600

    const timer = setTimeout(() => {
      onComplete()
      setIsComplete(true)
    }, total)

    return () => clearTimeout(timer)
  }, [delayBetween, leftRightStyle, onComplete])
  return (
    <div className={styles.wrapper}>
      {isComplete && (<div className={styles.container}>
        {textFancy ?? text}
      </div>)}
      {!isComplete && <div className={styles.container}>
        {leftText && (
          <div
            className={`${styles.leftText} ${
              canStartLeft ? styles.slide : ''
            }`}
          >
            {leftText}
          </div>
        )}

        {rightText && (
          <div
            className={`${styles.rightText} ${
              canStartRight ? styles.slide : ''
            }`}
          >
            {rightText}
          </div>
        )}
      </div>}
    </div>
  )
}