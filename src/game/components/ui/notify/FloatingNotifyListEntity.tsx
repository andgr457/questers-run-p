import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import styles from './FloatingNotify.module.css'
import type { FloatingNotify } from './types/FloatingNotify.types'

interface FloatingNotifyProps {
  notification: FloatingNotify
  onDone?: () => void
}

export default function FloatingNotifyListEntity(props: FloatingNotifyProps) {
  const [visible, setVisible] = useState(false)

  const {
    notification,
    onDone
  } = props

  const {
    id,
    text,
  } = notification

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 20)
    const hideTimer = setTimeout(() => setVisible(false), 2500)
    const removeTimer = setTimeout(() => onDone?.(), 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [onDone])


  return (
    <div
      id={`${id ?? 'notify'}_${DateTime.utc().toMillis()}`}
      className={`${styles.floatingNotify}${visible ? ' visible' : ''}`}
    >
      <span>{text}</span>
    </div>
  )
}