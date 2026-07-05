import { useEffect, useState } from 'react';
import { tutorialRuntimeService } from '../../../engine/tutorial/TutorialRuntimeService';
import { eventBus } from '../../../engine/event/EventBus';
import type { TutorialProgress, Tutorial } from '../types/Tutorial.types';

export function useTutorial(){
  const [tutorial, setTutorial] = useState<Tutorial | undefined>(undefined)
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress | undefined>(tutorialRuntimeService.getProgress())

  useEffect(() => {
    setTutorial(tutorialRuntimeService.getCurrentTutorial())
    setTutorialProgress(tutorialRuntimeService.getProgress())
  }, [])

  useEffect(() => {
    eventBus.subscribe(event => {
      if(event.type === 'tutorial:updated'){
        setTutorial(tutorialRuntimeService.getCurrentTutorial())
        setTutorialProgress(tutorialRuntimeService.getProgress())
      }
    })
  }, [])

  return {
    tutorial,
    tutorialProgress
  }
}