import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'

export interface CharacterEntity {
  id: string
  playerId: string
  partyId?: string
  
  name: string
  classId: CharacterClassId
  isIdle: boolean
  xp: number
  xpNextLevel: number
  level: number

  hp: number
  hpMax: number
  mana: number
  manaMax: number
  stamina: number
  staminaMax: number

  strength: number
  intellect: number
  agility: number

  locationId: string
}

export interface CharacterGoldTransaction {
  id: string
  characterId: string
  date: number
  amount: number
}
