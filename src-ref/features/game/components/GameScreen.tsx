import { useEffect } from 'react'
import styles from './GameScreen.module.css'
import { useGameClock } from '../../../game/engine/clock/useGameClock'
import { activityRuntimeService } from '../../activity/activityRuntimeService'
import ActivityCard from '../../activity/components/ActivityCard'
import ActivityPanel from '../../activity/components/ActivityPanel'
import QuestTracker from '../../quests/components/QuestTracker'

type Props = {
  characterId: string | null
}

export default function GameScreen({ characterId }: Props) {
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