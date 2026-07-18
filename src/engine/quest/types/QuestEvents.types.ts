import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types'
import type { GameEvent } from '../../event/types/EventBus.types'

export type QuestEventTypes = 'quest:start'
  | 'quest:started'
  | 'quest:complete'
  | 'quest:completed'

interface GameEvent_QuestStart extends GameEvent {
  type: 'quest:start'
  meta: {
    questId: string
    characterId: string
  }
}

interface GameEvent_QuestStarted extends GameEvent {
  type: 'quest:start'
  meta: {
    characterId: string
    quest: QuestEntity
  }
}

interface GameEvent_QuestComplete extends GameEvent {
  type: 'quest:complete'
  meta: {
    characterId: string
  }
}

interface GameEvent_QuestCompleted extends GameEvent {
  type: 'quest:completed'
  meta: {
    characterId: string
    quest: QuestEntity
  }
}

export type QuestEvents = GameEvent_QuestStart
  | GameEvent_QuestStarted
  | GameEvent_QuestComplete
  | GameEvent_QuestCompleted