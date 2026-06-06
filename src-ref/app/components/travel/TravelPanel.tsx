import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './TravelPanel.module.css'
import { useTravelActivity } from '../../../features/activity/hooks/useTravelActivity'
import type { RouteResult } from '../../../game/world/worldRouting'
import { useWorldTravelMap } from '../worldMap/hooks/useWorldTravelMap'
import WorldTravelMap from '../worldMap/WorldTravelMap'
import type { WorldLocation } from '../../../game/world/worldState'

type Props = {
  characterId: string | null
}

type Phase = 'hidden' | 'enter' | 'hold' | 'exit'

export default function TravelPanel({ characterId }: Props) {
  const travel = useTravelActivity(characterId)

  const [phase, setPhase] = useState<Phase>('hidden')

  const route: RouteResult = travel?.route ?? {
    steps: [],
    totalMs: 0,
  }

  const progress = travel?.progress ?? 0
  const elapsed = travel?.elapsedMs ?? 0

  useEffect(() => {
      if (!travel) {
        setPhase('hidden')
        return
      }

      setPhase('enter')

      const t = setTimeout(() => setPhase('hold'), 250)

      return () => clearTimeout(t)
    }, [travel?.activity?.id])
  const map = useWorldTravelMap(characterId)

  return createPortal(
    <div className={`${styles.panel} ${styles[phase]}`}>
      <div className={styles.backdrop} />

      <div className={styles.content}>
        {map && <div>
          <WorldTravelMap 
            currentLocation={map.currentLocation as WorldLocation}
            progress={map.progress}
            route={map.route}
          />
        </div>}

        <div className={styles.route}>
          <div className={styles.routeTrack} />

          {route.steps.map((step, index) => {
            const seg = travel?.segments?.[index]

            if(!seg) return null

            const segmentProgress =
              elapsed < seg.start
                ? 0
                : elapsed > seg.end
                  ? 1
                  : (elapsed - seg.start) / step.travelMs

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