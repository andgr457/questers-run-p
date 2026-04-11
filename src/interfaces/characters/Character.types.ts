
export interface Stats {
  strength?: Stat
  intelligence?: Stat
  agility?: Stat
  stamina?: Stat
  hp?: Stat
  mp?: Stat
}

export interface Stat {
  name: string
  value: number
  hint: string
  level?: number
  xp?: number
  nextLevelXP?: number
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
  xp: number
  achievements: CharacterAchievements[]
  stats: Stats
}