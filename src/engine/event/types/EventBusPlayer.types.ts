import type { PlayerEntity, PlayerGoldTransaction } from '../../../entity/player/types/PlayerEntity.types';
import type { GameEvent } from './EventBus.types';

export type PlayerEventTypes = 'player:save'
  | 'player:saved'
  | 'player:level'
  | 'player:gold'
  | 'player:gold:added'
  | 'player:xp'
  | 'player:xp:added'
  | 'player:token'
  | 'player:token:added'


export interface GameEvent_PlayerSave extends GameEvent {
  type: 'player:save'
  meta: {
    player: PlayerEntity
  }
}

export interface GameEvent_PlayerSaved extends GameEvent {
  type: 'player:saved'
}

export interface GameEvent_PlayerGold extends GameEvent {
  type: 'player:gold'
  meta: {
    playerGoldTransaction: PlayerGoldTransaction
  }
}

export interface GameEvent_PlayerGoldAdded extends GameEvent {
  type: 'player:gold:added'
}

export interface GameEvent_PlayerXP extends GameEvent {
  type: 'player:xp'
  meta: {
    xp: number
  }
}

export interface GameEvent_PlayerXPAdded extends GameEvent {
  type: 'player:xp:added'
}

export interface GameEvent_PlayerToken extends GameEvent {
  type: 'player:token'
  meta: {
    characterTokens: number
  }
}

export interface GameEvent_PlayerTokenAdded extends GameEvent {
  type: 'player:token:added'
}

export interface GameEvent_PlayerLevel extends GameEvent {
  type: 'player:level'
}

export type PlayerEvents = GameEvent_PlayerSave
  | GameEvent_PlayerSaved
  | GameEvent_PlayerLevel
  | GameEvent_PlayerGold
  | GameEvent_PlayerGoldAdded
  | GameEvent_PlayerXP
  | GameEvent_PlayerXPAdded
  | GameEvent_PlayerToken
  | GameEvent_PlayerTokenAdded