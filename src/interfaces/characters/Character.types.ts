
export interface Stats {
  strength?: Stat
  intelligence?: Stat
  agility?: Stat
  stamina?: Stat
  hp?: Stat
  mp?: Stat
}

export type StatName = 'AGI' | 'STR' | 'INT' | 'HP' | 'MP' | 'STAM'
export const StatFullName = {
  'AGI': 'Agility',
  'STR': 'Strength',
  'INT': 'Intellect',
  'HP': 'Health',
  'MP': 'Mana',
  'STAM': 'Stamina'
}
export interface Stat {
  name: StatName
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

export type GuildRank = '' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+' | 'S++'

export interface Character {
  id: string
  classId: string
  guildRank: GuildRank
  name: string
  level: number
  levelNextXP: number
  xp: number
  achievements: CharacterAchievements[]
  stats: Stats
}