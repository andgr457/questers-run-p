import { useEffect, useState } from 'react'
import { transitionService } from '../../game/engine/transitions/TransitionService'
import styles from './ScreenTransitionLayer.module.css'

export default function ScreenTransitionLayer() {
  const [state, setState] = useState(transitionService.getState())

  useEffect(() => {
    return transitionService.subscribe(setState)
  }, [])

  return (
    <div
      className={styles.overlay}
      data-phase={state.phase}
    >
      {/* ======================
          FOG LAYER
      ====================== */}
      <div className={styles.fog} />

      {/* ======================
          MID PHASE UI
      ====================== */}
      {state.phase === 'mid' && (
        <div className={styles.midPanel}>
          <h2>{state.payload?.title ?? 'Traveling...'}</h2>

          {state.payload?.description && (
            <p>{state.payload.description}</p>
          )}

          {typeof state.payload?.travelTime === 'number' && (
            <div className={styles.time}>
              Travel time: {state.payload.travelTime}ms
            </div>
          )}
        </div>
      )}
    </div>
  )
}