import { useEffect } from 'react'
import styles from './FloatingText.module.css'
import type { FloatingText } from '../../../engine/events/hooks/useFloatingTextEvents'

interface Props {
  floatingText: FloatingText
  onComplete: () => void
}

export default function FloatingText(props: Props) {
  useEffect(() => {
    const timer = setTimeout(props.onComplete, 1200)

    return () => clearTimeout(timer)
  }, [props.onComplete])

  return (
    <div
      className={styles.text}
      style={{
        left: props.floatingText.left,
        top: props.floatingText.top,
        color: props.floatingText.color,
      }}
    >
      {props.floatingText.text}
    </div>
  )
}