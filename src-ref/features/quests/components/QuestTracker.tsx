import { worldStateStore } from '../../../game/world/worldState'
import {
  findRoute,
} from '../../../game/world/worldRouting'
import { travel } from '../../../game/world/travel'

type Props = {
  characterId: string
}

function formatMs(ms: number) {
  return `${(ms / 1000).toFixed(0)}s`
}

export default function QuestTracker({
  characterId,
}: Props) {
  const world = worldStateStore.get(characterId)

  const currentLocation =
    world?.location ?? 'plains'

  const target = 'guild'

  const route = findRoute(
    currentLocation,
    target
  )

  if (!route) {
    return (
      <div>
        No route found.
      </div>
    )
  }

  const startTravel = () => {
    for (const step of route.steps) {
      travel({
        characterId,
        to: step.to,
        duration: step.travelMs,
        blocking: false,
      })
    }
  }

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.2)',
        padding: 16,
        borderRadius: 8,
        background: 'rgba(0,0,0,0.25)',
        maxWidth: 420,
      }}
    >
      <h3>
        📜 Current Quest
      </h3>

      <div>
        <strong>
          Join the Adventurers Guild
        </strong>
      </div>

      <p>
        Travel to the Guild Registrar.
      </p>

      <hr />

      <div>
        <strong>Route:</strong>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        {route.steps.map((step, index) => (
          <div key={index}>
            {step.from} → {step.to}
            {' • '}
            {formatMs(step.travelMs)}
          </div>
        ))}
      </div>

      <div>
        <strong>Total:</strong>{' '}
        {formatMs(route.totalMs)}
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={startTravel}>
          Go To Guild
        </button>
      </div>
    </div>
  )
}