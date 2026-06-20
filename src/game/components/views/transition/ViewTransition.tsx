import { useEffect, useState } from 'react'
import AnimatedText from '../../ui/animated-text/AnimatedText'
import type { ViewTransition } from './types/ViewTransition.types'
import styles from './ViewTransition.module.css'

interface Props {
  transition: ViewTransition
  className?: string
  onComplete?: () => void
}

export default function ViewTransition(props: Props) {
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
              }, 400)
            }
          }}
        />
      </div>
    </div>
  )
}