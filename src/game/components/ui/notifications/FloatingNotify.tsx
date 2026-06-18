// FloatingNotify.tsx
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import type { Notification } from './hooks/useFloatingNotify'
import './FloatingNotify.css'

export interface FloatingNotifyProps {
  notification: Notification
  onDone?: () => void
}

export default function FloatingNotify(props: FloatingNotifyProps) {
  const [visible, setVisible] = useState(false)

  const {
    notification,
    onDone
  } = props

  const {
    id,
    text,
    icon
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
      className={`floating-notify${visible ? ' visible' : ''}`}
    >
      {icon && <img src={icon} alt="" />}
      {text}
    </div>
  )
}