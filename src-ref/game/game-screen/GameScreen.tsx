import { useEffect } from 'react'
import styles from './GameScreen.module.css'
import ActivityCard from '../activity/components/ActivityCard'
import ActivityPanel from '../activity/components/ActivityPanel'
import { activityRuntimeService } from '../engine/activity/activityRuntimeService'
import { useGameClock } from '../engine/clock/useGameClock'
import QuestTracker from '../quest/components/QuestTracker'
import type { WorldLocation } from '../world/worldState'

type Props = {
  characterId: string | null
  currentLocation: WorldLocation
}

export default function GameScreen({ 
  characterId,
  currentLocation
}: Props) {
  const now = useGameClock()

  useEffect(() => {
    const unsub = activityRuntimeService.subscribe(
      () => activityRuntimeService.getActive(characterId as string),
      () => {}
    )

    return unsub
  }, [characterId])

  const activities = activityRuntimeService.getAll(characterId as string)
  const active = activityRuntimeService.getActive(characterId as string)

  return (
    <div className={styles.shell}>
      
      <header className={styles.header}>
        <h2>Quester's Run</h2>
        <h3>{currentLocation}</h3>
        <div>Character: {characterId}</div>

        <div>Time: {now}</div>

        <div>Active: {active.length}</div>
      </header>
      <QuestTracker characterId={characterId as string} />
      <ActivityPanel characterId={characterId as string} />

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
              {a.type} ({a.status}) - {JSON.stringify(a.meta)}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}