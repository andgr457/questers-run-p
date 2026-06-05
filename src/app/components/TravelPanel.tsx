import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './TravelPanel.module.css'
import { useTravelActivity } from '../../features/activity/hooks/useTravelActivity'

type Props = {
  characterId: string | null
  onArrive?: (to: string) => void
}

type Phase = 'hidden' | 'enter' | 'hold' | 'exit'

export default function TravelPanel({ characterId, onArrive }: Props) {
  const travel = useTravelActivity(characterId)
  const [phase, setPhase] = useState<Phase>('hidden')

  useEffect(() => {
    if (!travel) {
      setPhase('hidden')
      return
    }

    setPhase('enter')

    // const t = setTimeout(() => setPhase('hold'), 250)
    // return () => clearTimeout(t)
  }, [travel?.activity?.id])

  useEffect(() => {
    if (!travel) return
    if (phase !== 'hold') return

    if (travel.progress >= 1) {
      setPhase('exit')

      onArrive?.(travel.to)
      // const t = setTimeout(() => {
      // }, 300)

      // return () => clearTimeout(t)
    }
  }, [travel?.progress, phase])

  if (!travel) return null

  return createPortal(
    <div className={`${styles.panel} ${styles[phase]}`}>
      <div className={styles.backdrop} />

      <div className={styles.content}>
        <h2>Traveling</h2>

        <p>
          Heading to: <strong>{travel.to}</strong>
        </p>

        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${travel.progress * 100}%` }}
          />
        </div>

        <p className={styles.time}>
          {Math.round(travel.progress * travel.duration / 1000)}s / {travel.duration / 1000}s
        </p>
      </div>
    </div>,
    document.body
  )
}