import type { ActivityMeta, ActivityType } from '../../activity/types/Activity.types'

export interface GameEventSession {
  event: Partial<GameEvent>
  createdDate: number
}

export type GameEventType = 'activity:start'
  | 'activity:progress'
  | 'activity:complete'
  | 'activity:cancel'

  | 'player:dirty'
  | 'player:save'

  | 'character:dirty'
  | 'character:save'

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
  type: GameEventType
  characterId: string
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

export interface GameEvent_CharacterDirty extends GameEvent {
  type: 'character:dirty'
}

export interface GameEvent_CharacterSave extends GameEvent {
  type: 'character:save'
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

export type GameEvents = GameEvent_ActivityStart
  | GameEvent_ActivityProgress
  | GameEvent_ActivityComplete
  | GameEvent_ActivityCancel

  | GameEvent_PlayerDirty
  | GameEvent_PlayerSave

  | GameEvent_CharacterDirty
  | GameEvent_CharacterSave

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