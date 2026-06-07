import { useEffect, useState } from 'react'
import type { WorldLocation } from '../../../game/world/worldState'
import { gameEventBus } from '../../../game/engine/events/GameEventBus'

export function useGameState(characterId: string | null) {
  const [isTraveling, setIsTraveling] = useState(false)
  const [activeTravelId, setActiveTravelId] = useState<string | null>(null)
  const [location, setLocation] = useState<WorldLocation>('cave')

  useEffect(() => {
    if (!characterId) return

    const unsubActivity = gameEventBus.subscribe(event => {
      if (event.characterId !== characterId) return

      if (event.type === 'activity:start' && event.activityType === 'travel') {
        setIsTraveling(true)
        setActiveTravelId(event.activityId)
      }

      if (
        event.type === 'activity:complete' &&
        event.activityType === 'travel'
      ) {
        setIsTraveling(false)
        setActiveTravelId(null)
      }
    })

    const unsubWorld = gameEventBus.subscribe(event => {
      if (event.type !== 'world:location_changed') return
      if (event.characterId !== characterId) return

      setLocation(event.worldLocation as WorldLocation)
    })

    return () => {
      unsubActivity()
      unsubWorld()
    }
  }, [characterId])

  return {
    isTraveling,
    activeTravelId,
    location,
  }
}