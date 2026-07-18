import { useEffect } from 'react'
import styles from './FloatingText.module.css'

interface Props {
  text: string
  left: number
  top: number
  color?: string
  onComplete: () => void
}

export default function FloatingText({
  text,
  left,
  top,
  color = 'white',
  onComplete,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={styles.text}
      style={{
        left,
        top,
        color,
      }}
    >
      {text}
    </div>
  )
}