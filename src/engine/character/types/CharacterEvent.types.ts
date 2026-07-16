import type { CharacterEntity, CharacterGoldTransaction } from '../../../entity/character/types/CharacterEntity.types'
import type { GameEvent } from '../../event/types/EventBus.types'

export type CharacterEventTypes = 'character:save'
  | 'character:saved'
  | 'character:gold'
  | 'character:gold:added'
  | 'character:xp'
  | 'character:xp:added'
  | 'character:level'
  | 'character:stats'
  | 'character:stats:changed'
  | 'character:manage'
  | 'character:manage:added'


interface GameEvent_CharacterSave extends GameEvent {
  type: 'character:save'
  meta: {
    character: CharacterEntity
  }
}

interface GameEvent_CharacterSaved extends GameEvent {
  type: 'character:saved'
}

interface GameEvent_CharacterGold extends GameEvent {
  type: 'character:gold'
  meta: {
    characterGoldTransaction: CharacterGoldTransaction
  }
}

interface GameEvent_CharacterGoldAdded extends GameEvent {
  type: 'character:gold:added',
  meta: {
    characterId: string
    gold: number
  }
}

interface GameEvent_CharacterXP extends GameEvent {
  type: 'character:xp'
  meta: {
    characterId: string
    xp: number
  }
}

interface GameEvent_CharacterXPAdded extends GameEvent {
  type: 'character:xp:added'
  meta: {
    characterId: string
    xp: number
  }
}

interface GameEvent_CharacterLevel extends GameEvent {
  type: 'character:level'
  meta: {
    characterId: string
  }
}

interface GameEvent_CharacterManage extends GameEvent {
  type: 'character:manage'
  meta: {
    characterId: string
  }
}

interface GameEvent_CharacterManageAdded extends GameEvent {
  type: 'character:manage:added'
  meta: {
    characterId: string
  }
}

export type CharacterEvents = GameEvent_CharacterSave
  | GameEvent_CharacterSaved
  | GameEvent_CharacterGold
  | GameEvent_CharacterGoldAdded
  | GameEvent_CharacterXP
  | GameEvent_CharacterXPAdded
  | GameEvent_CharacterLevel
  | GameEvent_CharacterManage
  | GameEvent_CharacterManageAdded