import type { Character } from '../../../interfaces/Character.types'
import type { EntityAttributes } from '../../../interfaces/EntityBase.types'
import type { GuildRoleType } from '../../../interfaces/GuildRole.types'

export interface CharacterCreateEventMeta {
  character: Character
}

export interface CharacterCreatedEventMeta {
  character: Character
}

export interface CharacterSaveEventMeta {
  character: Character
}

export interface CharacterSavedEventMeta {
  character: Character
}

export interface CharacterGoldAddEventMeta {
  characterId: string
  value: number
}

export interface CharacterGoldAddedEventMeta {
  characterId: string
  value: number
}

export interface CharacterXpAddEventMeta {
  characterId: string
  value: number
}

export interface CharacterXpAddedEventMeta {
  characterId: string
  value: number
}

export interface CharacterAttributesAddEventMeta {
  characterId: string
  attributes: EntityAttributes
}

export interface CharacterAttributesAddedEventMeta {
  characterId: string
  attributes: EntityAttributes
}

export interface CharacterLevelAddedEventMeta {
  characterId: string
  level: number
}

export interface CharacterHPAddedEventMeta {
  characterId: string
  value: number
}

export interface CharacterManaAddedEventMeta {
  characterId: string
  value: number
}

export interface CharacterStaminaAddedEventMeta {
  characterId: string
  value: number
}

export interface CharacterGuildAddEventMeta {
  characterId: string
  guildId: string
  guildRole: GuildRoleType
}

export interface CharacterGuildAddedEventMeta {
  characterId: string
  guildId: string
  guildRole: GuildRoleType
}

export interface CharacterEventMap {
  'character:create': CharacterCreateEventMeta,
  'character:created': CharacterCreatedEventMeta,

  'character:save': CharacterSaveEventMeta
  'character:saved': CharacterSavedEventMeta

  'character:attributes:add': CharacterAttributesAddEventMeta
  'character:attributes:added': CharacterAttributesAddedEventMeta

  'character:gold:add': CharacterGoldAddEventMeta
  'character:gold:added': CharacterGoldAddedEventMeta

  'character:hp:added': CharacterHPAddedEventMeta
  'character:mana:added': CharacterManaAddedEventMeta
  'character:stamina:added': CharacterStaminaAddedEventMeta

  'character:xp:add': CharacterXpAddEventMeta
  'character:xp:added': CharacterXpAddedEventMeta

  'character:level:added': CharacterLevelAddedEventMeta

  'character:guild:add': CharacterGuildAddEventMeta
  'character:guild:added': CharacterGuildAddedEventMeta
}


