import type { ActivityMeta, ActivityType } from '../../activity/types/Activity.types'

export interface EventSession {
  event: Partial<GameEvents>
  createdDate: number
}

export type GameEventType = 'activity:start'
  | 'activity:progress'
  | 'activity:complete'
  | 'activity:cancel'

  | 'event:debug:recording:start'
  | 'event:debug:recording:started'
  | 'event:debug:recording:stop'
  | 'event:debug:recording:stopped'
  | 'event:debug:recording:history'

  | 'mode:settings'

  | 'player:dirty'
  | 'player:save'
  | 'player:saved'

  | 'character:dirty'
  | 'character:save'
  | 'character:saved'

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

export interface GameEvent_PlayerDirty extends GameEvent {
  type: 'player:dirty'
}

export interface GameEvent_PlayerSave extends GameEvent {
  type: 'player:save'
}

export interface GameEvent_PlayerSaved extends GameEvent {
  type: 'player:saved'
}

export interface GameEvent_CharacterDirty extends GameEvent {
  type: 'character:dirty'
}

export interface GameEvent_CharacterSave extends GameEvent {
  type: 'character:save'
}

export interface GameEvent_CharacterSaved extends GameEvent {
  type: 'character:saved'
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

export interface GameEvent_ModeSettings extends GameEvent {
  type: 'mode:settings'
  meta: {
    mode: string
  }
}

export interface GameEvent_DebugRecordingStart extends GameEvent {
  type: 'event:debug:recording:start'
}

export interface GameEvent_DebugRecordingStarted extends GameEvent {
  type: 'event:debug:recording:started'
}

export interface GameEvent_DebugRecordingStop extends GameEvent {
  type: 'event:debug:recording:stop'
}

export interface GameEvent_DebugRecordingStopped extends GameEvent {
  type: 'event:debug:recording:stopped'
}

export interface GameEvent_DebugRecordingHistory extends GameEvent {
  type: 'event:debug:recording:history'
}

export type GameEvents = GameEvent_ActivityStart
  | GameEvent_ActivityProgress
  | GameEvent_ActivityComplete
  | GameEvent_ActivityCancel

  | GameEvent_DebugRecordingStart
  | GameEvent_DebugRecordingStarted
  | GameEvent_DebugRecordingStop
  | GameEvent_DebugRecordingStopped
  | GameEvent_DebugRecordingHistory

  | GameEvent_ModeSettings

  | GameEvent_PlayerDirty
  | GameEvent_PlayerSave
  | GameEvent_PlayerSaved

  | GameEvent_CharacterDirty
  | GameEvent_CharacterSave
  | GameEvent_CharacterSaved

  | GameEvent_QuestStart 
  | GameEvent_QuestCancel 
  | GameEvent_QuestComplete

  | GameEvent_TavernStart
  | GameEvent_TavernCancel
  | GameEvent_TavernComplete

  | GameEvent_UpgradePurchased

  | {
      type: 'character:xp:add'
      characterId: string
      amount: number
      source?: string
    }
  | {
      type: 'character:stamina:add'
      characterId: string
      amount: number
      source?: string
    }
  | {
      type: 'character:stamina:remove'
      characterId: string
      amount: number
      source?: string
    }

export interface EventBusLog {
  date: number
  event: GameEvent
}