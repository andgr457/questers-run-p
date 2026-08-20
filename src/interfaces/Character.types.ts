import type { EntityAttributeProperty, EntityAttributes, EntityBase } from './EntityBase.types';
import type { GuildRoleType } from './GuildRole.types';

export interface Character extends EntityBase {
  classId: string
  
  guildId: string
  guildRole: GuildRoleType

  partyId: string

  gold: number 
  level: number
  
  attributes: EntityAttributes
  professions: CharacterProfession[]
}

export interface CharacterProfession {
  id: string
  professionId: string
  level: number
  xp: EntityAttributeProperty
}