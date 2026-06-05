import { useEffect } from 'react'
import styles from './GameScreen.module.css'
import { useGameClock } from '../../../game/engine/clock/useGameClock'
import { activityRuntimeService } from '../../activity/activityRuntimeService'
import ActivityCard from '../../activity/components/ActivityCard'
import ActivityPanel from '../../activity/components/ActivityPanel'
type Props = {
  characterId: string
}

export default function GameScreen({ characterId }: Props) {
  const now = useGameClock()

  useEffect(() => {
    const unsub = activityRuntimeService.subscribe(
      () => activityRuntimeService.getActive(characterId),
      () => {}
    )

    return unsub
  }, [characterId])

  const activities = activityRuntimeService.getAll(characterId)
  const active = activityRuntimeService.getActive(characterId)

  return (
    <div className={styles.shell}>
      
      <header className={styles.header}>
        <h2>Quester's Run</h2>

        <div>Character: {characterId}</div>

        <div>Time: {now}</div>

        <div>Active: {active.length}</div>
      </header>
      
      <ActivityPanel characterId={characterId} />

      <main className={styles.main}>
        <div className={styles.panel}>
          <h3>Active Activities</h3>

          {active.map(a => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>

        <div className={styles.panel}>
          <h3>World</h3>
        </div>

        <div className={styles.panel}>
          <h3>All Activities</h3>

          {activities.map(a => (
            <div key={a.id}>
              {a.type} ({a.status})
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}