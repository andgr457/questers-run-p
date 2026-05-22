import type { ProfessionStatName, ProfessionStats } from '../professsions/Profession.types'

export interface Stats {
  hp: Stat
  mp: Stat
  stamina: Stat
  strength: Stat
  intelligence: Stat
  agility: Stat
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
  name: StatName | ProfessionStatName
  value: number
  max: number
  hint?: string
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

export const GuildRankLevelByRank = {
  '': 0,
  'F': 1,
  'E': 2,
  'D': 3,
  'C': 4,
  'B': 5,
  'A': 6,
  'S': 7,
  'SS': 8,
  '◇': 9,
}

export const GuildRankByLevel = {
  0: '',
  1: 'F',
  2: 'E',
  3: 'D',
  4: 'C',
  5: 'B',
  6: 'A',
  7: 'S',
  8: 'SS',
  9: '◇',
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


