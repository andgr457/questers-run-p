import { useEffect, useState } from 'react';
import { transitionRuntimeService } from '../TransitionRuntimeService';
import type { Transition } from '../../../ui/transition/types/Transition.types';
import { eventBus } from '../../event/EventBus';

export function useTransition() {
  const [transition, setTransition] = useState<Transition | undefined>(transitionRuntimeService.getCurrentTransition())

  useEffect(() => {
    eventBus.subscribe(event => {
      if(event.type.includes('transition:')){
        setTransition(transitionRuntimeService.getCurrentTransition())
      }
    })
  }, [])

  return {
    transition
  }
}