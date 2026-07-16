import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'
import type { Transition } from '../../../ui/transition/types/Transition.types'
import type { ActivityType } from '../../activity/types/Activity.types'
import type { CharacterEvents, CharacterEventTypes } from '../../character/types/CharacterEvent.types'
import type { DebugEvents, DebugEventTypes } from './EventBusDebug.types'
import type { PartyEvents, PartyEventTypes } from '../../party/types/PartyEvent.types'
import type { PlayerEvents, PlayerEventTypes } from '../../player/types/PlayerEvent.types'
import type { RewardsEvents, RewardsEventTypes } from '../../rewards/types/RewardsEvents.types'
import type { TutorialEvents, TutorialEventTypes } from '../../tutorial/types/TutorialEvents.types'
import type { NotificationEvents, NotificationEventTypes } from '../../notification/types/NotificationEvent.types'
import type { CharacterEntity, CharacterGoldTransaction } from '../../../entity/character/types/CharacterEntity.types'
import type { LocationEntity } from '../../../entity/location/types/LocationEntity.types'
import type { PartyEntity } from '../../../entity/party/types/PartyEntity.types'
import type { PlayerEntity, PlayerGoldTransaction } from '../../../entity/player/types/PlayerEntity.types'
import type { TutorialReward } from '../../../game/tutorial/types/Tutorial.types'
import type { NotificationEventAddMeta } from '../../../game/notification/types/Notification.types'
import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types'
import type { QuestEvents, QuestEventTypes } from '../../quest/types/QuestEvents.types'

export interface EventSession {
  event: Partial<GameEvents>
  createdDate: number
}

export type GameEventType = PlayerEventTypes 
  | DebugEventTypes
  | CharacterEventTypes
  | PartyEventTypes
  | RewardsEventTypes
  | TutorialEventTypes
  | NotificationEventTypes
  | QuestEventTypes

  | 'world:mode:change'

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
  meta?: EventMeta
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

export interface GameEvent_EventTransitionStart extends GameEvent {
  type: 'transition:start'
  meta: {
    transition: Transition
  }
}

export interface GameEvent_EventTransitionStarted extends GameEvent {
  type: 'transition:started'
  meta: {
    transition: Transition
  }
}


export interface GameEvent_EventTransitionStop extends GameEvent {
  type: 'transition:stop'
  meta: {
    transition: Transition
  }
}

export type GameEvents = GameEvent_ActivityStart
  | GameEvent_ActivityProgress
  | GameEvent_ActivityComplete
  | GameEvent_ActivityCancel
  | GameEvent_WorldModeChange
  | GameEvent_EventTransitionStart
  | GameEvent_EventTransitionStarted
  | GameEvent_EventTransitionStop

  | DebugEvents

  | PlayerEvents
  | CharacterEvents
  | PartyEvents
  | RewardsEvents
  | TutorialEvents
  | NotificationEvents
  | QuestEvents

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
export type EventMeta = {
  isDebugMode?: boolean
  worldMode?: OverlayMode
  transition?: Transition
  destination?: LocationEntity
  departure?: LocationEntity

  xp?: number
  characterTokens?: number
  gold?: number

  player?: PlayerEntity
  playerGoldTransaction?: PlayerGoldTransaction

  character?: CharacterEntity
  characterId?: string
  characterGoldTransaction?: CharacterGoldTransaction
  characterIds?: string[]


  party?: PartyEntity
  partyId?: string

  tutorialId?: string
  tutorialRewards?: TutorialReward[]

  notification?: NotificationEventAddMeta
  notificationId?: string

  questId?: string
  quest?: QuestEntity
}
