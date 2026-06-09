import { useEffect, useState } from 'react'
import { gameEventBus } from '../../events/GameEventBus'

export function useActivityState(
  characterId: string | null,
  type: string
) {
  const [state, setState] = useState(() =>
    characterId
      ? gameEventBus.getActivity(characterId, type)
      : null
  )

  useEffect(() => {
    if (!characterId) return

    const unsub = gameEventBus.subscribe((event) => {
      if (
        event.type === 'activity:progress' ||
        event.type === 'activity:complete' ||
        event.type === 'activity:cancel'
      ) {
        if (
          event.characterId === characterId &&
          event.activityType === type
        ) {
          setState(gameEventBus.getActivity(characterId, type))
        }
      }
    })

    return unsub
  }, [characterId, type])

  return state
}