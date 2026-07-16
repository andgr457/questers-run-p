import type { GameEvent } from '../../event/types/EventBus.types'

export type TutorialEventTypes =
  | 'tutorial:complete'
  | 'tutorial:completed'
  | 'tutorial:collect'
  | 'tutorial:collected'

interface GameEvent_TutorialComplete extends GameEvent {
  type: 'tutorial:complete'
  meta: {
    tutorialId: string
  }
}

interface GameEvent_TutorialCompleted extends GameEvent {
  type: 'tutorial:completed'
  meta: {
    tutorialId: string
  }
}

interface GameEvent_TutorialCollect extends GameEvent {
  type: 'tutorial:collect'
  meta: {
    tutorialId: string
  }
}

interface GameEvent_TutorialCollected extends GameEvent {
  type: 'tutorial:collected'
  meta: {
    tutorialId: string
  }
}

export type TutorialEvents =
  | GameEvent_TutorialComplete
  | GameEvent_TutorialCompleted
  | GameEvent_TutorialCollect
  | GameEvent_TutorialCollected