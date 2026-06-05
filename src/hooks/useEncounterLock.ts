import { useEffect, useState } from 'react'
import { encounterRuntimeStore } from '../features/runtime/store/encounterRuntimeStore'

export function useEncounterLock(characterId: string) {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    return encounterRuntimeStore.subscribe(() => {
      setLocked(
        encounterRuntimeStore.isLocked(characterId)
      )
    })
  }, [characterId])

  return locked
}