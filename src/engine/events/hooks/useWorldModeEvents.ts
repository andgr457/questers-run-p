import { useEffect, useState } from 'react';
import { worldModeEventService } from '../services/WorldModeEventService';
import { eventBus } from '../EventBus';

export function useWorldModeEvents(){
  const [worldModeMain, setWorldModeMain] = useState(
    worldModeEventService.getWorldModeMain()
  )
  const [worldModeOverlay, setWorldModeOverlay] = useState(
    worldModeEventService.getWorldModeOverlay()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes('world:mode:')) return
      if(event.type === 'world:mode:main:changed'){
        setWorldModeMain(
          worldModeEventService.getWorldModeMain()
        )
      }
      if(event.type === 'world:mode:overlay:changed'){
        setWorldModeOverlay(
          worldModeEventService.getWorldModeOverlay()
        )
      }
    })
  }, [])

  return {
    worldModeMain,
    worldModeOverlay
  }
}