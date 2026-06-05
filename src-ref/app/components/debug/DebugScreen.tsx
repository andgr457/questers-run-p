import { useEffect, useMemo, useState } from 'react'
import { activityRuntimeService } from '../../../features/activity/activityRuntimeService'
import { gameClockService } from '../../../game/engine/clock/GameClockService'
import { travel } from '../../../game/world/travel'
import { worldStateStore } from '../../../game/world/worldState'

export default function DebugScreen() {
  const [characterId] = useState('debug-char')

  // ======================
  // CLOCK STATE (reactive, not force rerender spam)
  // ======================
  const [now, setNow] = useState(gameClockService.getNow())

  // ======================
  // WORLD STATE (reactive)
  // ======================
  const [world, setWorld] = useState(() =>
    worldStateStore.get(characterId)
  )

  // ======================
  // ACTIVITIES (reactive snapshot)
  // ======================
  const [activities, setActivities] = useState(() =>
    activityRuntimeService.getAll(characterId)
  )

  useEffect(() => {
    const unsubClock = gameClockService.subscribe((t) => {
      setNow(t)
    })

    const unsubActivities = activityRuntimeService.subscribe(
      () => activityRuntimeService.getAll(characterId),
      (val) => setActivities(val)
    )

    // world currently has no subscription API → poll safely (lightweight)
    const worldInterval = setInterval(() => {
      setWorld(worldStateStore.get(characterId))
    }, 500)

    return () => {
      unsubClock()
      unsubActivities()
      clearInterval(worldInterval)
    }
  }, [characterId])

  // ======================
  // TRAVEL TESTS
  // ======================
  const travelTo = (location: any) => {
    travel({
      characterId,
      to: location,
      duration: 5000,
      blocking: false,
    })
  }

  // ======================
  // ACTIONS
  // ======================
  const spawnHunt = () => {
    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      type: 'hunting',
      startedAt: gameClockService.getNow(),
      duration: 8000,
      status: 'active',
      blocking: true,
    })
  }

  const spawnQuest = () => {
    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      type: 'quest',
      startedAt: gameClockService.getNow(),
      duration: 15000,
      status: 'active',
      blocking: false,
    })
  }

  const completeAll = () => {
    activities.forEach(a =>
      activityRuntimeService.complete(characterId, a.id)
    )
  }

  const cancelAll = () => {
    activities.forEach(a =>
      activityRuntimeService.cancel(characterId, a.id)
    )
  }

  const clearAll = () => {
    activities.forEach(a =>
      activityRuntimeService.remove(characterId, a.id)
    )
  }

  // ======================
  // DERIVED STATE (cheap + stable)
  // ======================
  const debugState = useMemo(() => {
    const active = activities.filter(a => a.status === 'active')

    return {
      now,
      world,
      activities: {
        all: activities.length,
        active: active.length,
      },
      locked: activityRuntimeService.isLocked(characterId),
    }
  }, [now, world, activities, characterId])

  // ======================
  // UI
  // ======================
  return (
    <div style={{ 
      padding: 20,
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'auto',
      boxSizing: 'border-box',

    }}>
      <h1>🧪 RPG Engine Debug</h1>

      <p>
        Character: <strong>{characterId}</strong>
      </p>

      {/* WORLD */}
      <div style={{ marginBottom: 15 }}>
        <h3>🌍 Travel Tests</h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => travelTo('plains')}>Plains</button>
          <button onClick={() => travelTo('guild')}>Guild</button>
          <button onClick={() => travelTo('woods')}>Woods</button>
          <button onClick={() => travelTo('cave')}>Cave</button>
          <button onClick={() => travelTo('dungeon')}>Dungeon</button>
        </div>
      </div>

      {/* ACTIVITY */}
      <div style={{ marginBottom: 15 }}>
        <h3>⚔️ Activities</h3>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={spawnHunt}>Hunt (8s)</button>
          <button onClick={spawnQuest}>Quest (15s)</button>
          <button onClick={completeAll}>Complete All</button>
          <button onClick={cancelAll}>Cancel All</button>
          <button onClick={clearAll}>Clear</button>
        </div>
      </div>

      <hr />

      {/* LIVE STATE */}
      <h3>📊 Live Engine State</h3>

      <div style={{ marginBottom: 10 }}>
        <div>Time: {now}</div>
        <div>Location: {world?.location}</div>
        <div>Intro Seen: {String(world?.flags?.introSeen)}</div>
        <div>
          Activities: {debugState.activities.active}/{debugState.activities.all}
        </div>
        <div>Locked: {String(debugState.locked)}</div>
      </div>

      <pre
        style={{
          background: '#111',
          color: '#0f0',
          padding: 10,
          borderRadius: 6,
          maxHeight: 400,
          overflow: 'auto',
        }}
      >
        {JSON.stringify(debugState, null, 2)}
      </pre>
    </div>
  )
}