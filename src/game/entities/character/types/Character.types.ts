
export interface CharacterEntity {
  id: string
  playerId: string
  partyId?: string
  
  name: string
  classId: string
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
}