
export interface Stats {
  strength?: number
  intelligence?: number
  agility?: number
  stamina?: number
  hp?: number
  mp?: number
}

export type BuffType = 'buff' | 'debuff'

export interface Buff {
  id: string
  type: BuffType
  name: string
  stats: string
}

export interface CharacterClass {
  id: string
  name: string
  description: string
  stats: Stats
  
}

export interface CharacterAchievements {
  achievementId: string
  achievementDate: string
}

export interface Character {
  id: string
  classId: string
  name: string
  level: number
  levelNextXP: number
  achievements: CharacterAchievements[]
  stats: Stats
}