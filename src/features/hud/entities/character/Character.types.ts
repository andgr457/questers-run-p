import type { CharacterClassId } from './CharacterClass.types'

export interface Character {
  id: string
  name: string
  classId: CharacterClassId
  
  xp: number

  gold: number

  level: number
  
  hp: number
  mp: number
  stamina: number
}

