import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'
import type { Transition } from '../../../ui/transition/types/Transition.types'
import type { ActivityMeta, ActivityType } from '../../activity/types/Activity.types'
import type { CharacterEvents, CharacterEventTypes } from './EventBusCharacter.types'
import type { DebugEvents, DebugEventTypes } from './EventBusDebug.types'
import type { PartyEvents, PartyEventTypes } from '../../party/types/EventBusParty.types'
import type { PlayerEvents, PlayerEventTypes } from './EventBusPlayer.types'

export interface EventSession {
  event: Partial<GameEvents>
  createdDate: number
}

export type GameEventType = PlayerEventTypes 
  | DebugEventTypes
  | CharacterEventTypes
  | PartyEventTypes
  | 'world:mode:change'
  | 'event:history:updated'

  | 'tutorial:updated'

  | 'transition:start'
  | 'transition:started'
  | 'transition:stop'

  | 'activity:start'
  | 'activity:progress'
  | 'activity:complete'
  | 'activity:cancel'

  | 'mode:settings'

  | 'quest:start'
  | 'quest:cancel'
  | 'quest:complete'

  | 'character:xp:add'
  | 'character:stamina:add'
  | 'character:stamina:remove'
  | 'character:hp:add'
  | 'character:hp:remove'
  | 'character:mp:add'
  | 'character:mp:remove'
  

  | 'tavern:start'
  | 'tavern:cancel'
  | 'tavern:complete'

  | 'upgrade:purchased'

export interface GameEvent {
  id: string
  parentEventId?: string
  type: GameEventType
  characterId?: string
  continuous?: boolean
  duration?: number
  meta?: ActivityMeta
}

export interface ActivityGameEvent extends GameEvent {
  activityId: string
  activityType: ActivityType
}

export interface GameEvent_WorldModeChange extends GameEvent {
  type: 'world:mode:change'
  meta: {
    worldMode: OverlayMode
  }
}

export interface GameEvent_ActivityStart extends ActivityGameEvent {
  type: 'activity:start'
}

export interface GameEvent_ActivityProgress extends ActivityGameEvent {
  type: 'activity:progress'
  progress: number
}

export interface GameEvent_ActivityComplete extends ActivityGameEvent {
  type: 'activity:complete'
}

export interface GameEvent_ActivityCancel extends ActivityGameEvent {
  type: 'activity:cancel'
}

export interface GameEvent_QuestStart extends GameEvent {
  type: 'quest:start'
}

export interface GameEvent_QuestCancel extends GameEvent {
  type: 'quest:cancel'
}

export interface GameEvent_QuestComplete extends GameEvent {
  type: 'quest:complete'
}

export interface GameEvent_TavernStart extends GameEvent {
  type: 'tavern:start'
}

export interface GameEvent_TavernCancel extends GameEvent {
  type: 'tavern:cancel'
}

export interface GameEvent_TavernComplete extends GameEvent {
  type: 'tavern:complete'
}

export interface GameEvent_UpgradePurchased extends GameEvent {
  type: 'upgrade:purchased'
}

export interface GameEvent_EventHistoryUpdated extends GameEvent {
  type: 'event:history:updated'
}

export interface GameEvent_EventTutorialUpdated extends GameEvent {
  type: 'tutorial:updated'
}

export interface GameEvent_EventTransitionStart extends GameEvent {
  type: 'transition:start'
  meta: {
    transition: Transition
    characterId?: string
    partyId?: string
    destinationId: string
  }
}

export interface GameEvent_EventTransitionStarted extends GameEvent {
  type: 'transition:started'
  meta: {
    characterId?: string
    partyId?: string
    locationId: string
  }
}


export interface GameEvent_EventTransitionStop extends GameEvent {
  type: 'transition:stop'
  meta: {
    characterId?: string
    partyId?: string
    locationId: string
  }
}

export type GameEvents = GameEvent_ActivityStart
  | GameEvent_ActivityProgress
  | GameEvent_ActivityComplete
  | GameEvent_ActivityCancel
  | GameEvent_WorldModeChange
  | GameEvent_EventHistoryUpdated
  | GameEvent_EventTutorialUpdated
  | GameEvent_EventTransitionStart
  | GameEvent_EventTransitionStarted
  | GameEvent_EventTransitionStop

  | DebugEvents

  | PlayerEvents
  | CharacterEvents
  | PartyEvents

  | GameEvent_QuestStart 
  | GameEvent_QuestCancel 
  | GameEvent_QuestComplete

  | GameEvent_TavernStart
  | GameEvent_TavernCancel
  | GameEvent_TavernComplete

  | GameEvent_UpgradePurchased

export interface EventBusLog {
  date: number
  event: GameEvent
}