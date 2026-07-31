import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import styles from './WarpOverlay.module.css'
import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'
import { eventBus } from '../../../engine/event/EventBus'

interface Props {
  active: boolean
  overlayModeOnComplete: OverlayMode
  waitMs: number
  text?: string
}

export default function WarpOverlay(props: Props) {
  const [show, setShow] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        style: {
          '--x': `${Math.random() * 100}%`,
          '--y': `${Math.random() * 100}%`,
          '--delay': `${Math.random() * 2}s`,
          '--duration': `${0.6 + Math.random() * 0.9}s`
        } as CSSProperties
      })),
    []
  )

  useEffect(() => {
    if (!props.active) {
      return
    }

    setShow(true)

    const fadeTimer = window.setTimeout(() => {
      setShow(false)
    }, props.waitMs)

    const finishTimer = window.setTimeout(() => {
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'world:mode:change',
        meta: {
          worldMode: props.overlayModeOnComplete,
        }
      })
    }, props.waitMs + 500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(finishTimer)
    }
  }, [props])

  if (!props.active) {
    return null
  }

  return (
    <div className={`${styles.wrapper} ${show ? styles.show : ''}`}>
      <div className={styles.tunnel}>
        {props.text && (
          <div className={styles.text}>
            {props.text}
          </div>
        )}
        {stars.map(star => (
          <span
            key={star.id}
            className={styles.star}
            style={star.style}
          />
        ))}
      </div>
    </div>
  )
}