import { useEffect, useState } from 'react';
import { tutorialRuntimeService } from '../../../engine/tutorial/TutorialRuntimeService';
import { eventBus } from '../../../engine/event/EventBus';
import type { Tutorial, TutorialProgress } from '../../../game/tutorial/types/Tutorial.types';

export function useTutorial(){
  const [tutorial, setTutorial] = useState<Tutorial | undefined>(tutorialRuntimeService.getCurrentTutorial())
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress | undefined>(
    tutorialRuntimeService.getProgress()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'tutorial:updated'){
        setTutorial(tutorialRuntimeService.getCurrentTutorial())
        setTutorialProgress(tutorialRuntimeService.getProgress())
      }
    })
    return unsub
  }, [])

  return {
    tutorial,
    tutorialProgress
  }
}