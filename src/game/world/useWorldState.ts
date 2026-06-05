import { useEffect, useState } from 'react'
import { worldStateStore } from './worldState'

export function useWorldState(characterId: string | null) {
  const [worldState, setWorldState] = useState(
    characterId
      ? worldStateStore.get(characterId)
      : undefined
  )

  useEffect(() => {
    if (!characterId) return

    const unsub = worldStateStore.subscribe(
      () => worldStateStore.get(characterId),
      (next) => {
        setWorldState(next)
      }
    )

    return unsub
  }, [characterId])

  return worldState
}