import { useEffect, useState } from 'react';
import { transitionRuntimeService } from '../../engine/transition/TransitionRuntimeService';
import { eventBus } from '../../engine/event/EventBus';
import TransitionDetail from '../../ui/transition/TransitionDetail';

export default function TravelTransition(){
  const [transitionState, setTransitionState] = useState(transitionRuntimeService.getCurrentTransition())
  
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'transition:start'){
        setTransitionState(transitionRuntimeService.getCurrentTransition())
      }
      if(event.type === 'transition:started'){
        setTransitionState(transitionRuntimeService.getCurrentTransition())
      }
      if(event.type === 'transition:stop'){
        setTransitionState(transitionRuntimeService.getCurrentTransition())
      }
    })
    return unsub
  }, [])

  if(
    !transitionState || 
    !transitionState.transition

  ) return null

  return <TransitionDetail 
    transition={transitionState.transition}
  />
}