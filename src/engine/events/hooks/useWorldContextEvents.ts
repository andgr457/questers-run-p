import { useEffect, useState } from 'react';
import { worldContextEventService } from '../services/WorldContextEventService';
import type { WorldContextStorage } from '../services/types/WorldContext.types';
import { eventBus } from '../EventBus';

export function useWorldContextEvents(){
  const [worldContext, setWorldContext] = useState<WorldContextStorage>(
    worldContextEventService.getWorldContext()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes('world:context')) return
      setWorldContext(
        worldContextEventService.getWorldContext()
      )
    })
    return unsub
  })

  return {
    worldContext
  }
}