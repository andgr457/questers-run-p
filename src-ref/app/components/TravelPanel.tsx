import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './TravelPanel.module.css'
import { useTravelActivity } from '../../features/activity/hooks/useTravelActivity'
import type { RouteResult } from '../../game/world/worldRouting'

type Props = {
  characterId: string | null
}

type Phase = 'hidden' | 'enter' | 'hold' | 'exit'

export default function TravelPanel({ characterId }: Props) {
  const travel = useTravelActivity(characterId)

  const [phase, setPhase] = useState<Phase>('hidden')
  const [arrivalLock, setArrivalLock] = useState(false)

  const route: RouteResult = travel?.route ?? {
    steps: [],
    totalMs: 0,
  }

  const progress = travel?.progress ?? 0
  const elapsed = travel?.elapsedMs ?? 0

  // ======================
  // ENTER
  // ======================
  useEffect(() => {
    if (!travel) {
      setPhase('hidden')
      setArrivalLock(false)
      return
    }

    setArrivalLock(false)
    setPhase('hidden')

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('enter')

        const holdTimer = setTimeout(() => {
          setPhase('hold')
        }, 350)

        return () => clearTimeout(holdTimer)
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [travel?.activity?.id])

  // ======================
  // ARRIVAL DETECTION (FIXED)
  // ======================

  useEffect(() => {
    if (!travel) return
    if (phase !== 'hold') return
    if (arrivalLock) return

    setArrivalLock(true)

    // IMPORTANT: this is your "standing on destination, UI still fading"
    const t = setTimeout(() => {
      setPhase('exit')
    }, 2800) // <- shorter but feels better when paired with CSS exit slide

    return () => clearTimeout(t)
  }, [phase, arrivalLock, travel])

  return createPortal(
    <div className={`${styles.panel} ${styles[phase]}`}>
      <div className={styles.backdrop} />

      <div className={styles.content}>
        <div className={styles.route}>
          <div className={styles.routeTrack} />

          {route.steps.map((step, index) => {
            const start = route.steps
              .slice(0, index)
              .reduce((sum, s) => sum + s.travelMs, 0)

            const end = start + step.travelMs

            const segmentProgress =
              elapsed < start
                ? 0
                : elapsed > end
                  ? 1
                  : (elapsed - start) / step.travelMs

            const completed = segmentProgress >= 1
            const active = segmentProgress > 0 && segmentProgress < 1

            return (
              <div
                key={`${step.from}-${step.to}-${index}`}
                className={styles.segment}
                data-active={active}
                data-completed={completed}
              >
                <div
                  className={styles.segmentFill}
                  style={{ width: `${segmentProgress * 100}%` }}
                />

                <div className={styles.segmentContent}>
                  <div className={styles.labelText}>
                    {step.to.toUpperCase()}
                  </div>

                  <div className={styles.labelProgress}>
                    {Math.round(segmentProgress * 100)}%
                  </div>
                </div>
              </div>
            )
          })}

          <div
            className={styles.marker}
            style={{
              left: `${progress * 100}%`,
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}