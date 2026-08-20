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
  const [transitionText, setTranstionText] = useState(
    worldModeEventService.getTransitionText()
  )
  const [transitionOnCompleteMode, setTransitionOnCompleteMode] = useState(
    worldModeEventService.getTransitionOnCompleteMode()
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
        setTranstionText(
          worldModeEventService.getTransitionText()
        )
        setTransitionOnCompleteMode(
          worldModeEventService.getTransitionOnCompleteMode()
        )
        setWorldModeOverlay(
          worldModeEventService.getWorldModeOverlay()
        )
      }
    })
    return unsub
  }, [])

  return {
    worldModeMain,
    worldModeOverlay,
    transitionText,
    transitionOnCompleteMode
  }
}