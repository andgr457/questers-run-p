import type { ProfessionStats } from '../professsions/Profession.types'

export interface Stats {
  hp?: Stat
  mp?: Stat
  stamina?: Stat
  strength?: Stat
  intelligence?: Stat
  agility?: Stat
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
export const StatSort = {
  'HP': 0,
  'MP': 1,
  'STAM': 2,
  'AGI': 3,
  'STR': 4,
  'INT': 5,
}

export interface Stat {
  name: StatName | string
  value: number
  max?: number
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

export type GuildRank = '' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | '◇'

export const GuildRanks = {
  None: '' as GuildRank,
  F: 'F' as GuildRank,
  E: 'E' as GuildRank,
  D: 'D' as GuildRank,
  C: 'C' as GuildRank,
  B: 'B' as GuildRank,
  A: 'A' as GuildRank,
  S: 'S' as GuildRank,
  SS: 'SS' as GuildRank,
  Diamond: '◇' as GuildRank
}

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
  professions: ProfessionStats
  gold?: number
}


