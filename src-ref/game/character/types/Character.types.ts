import type { ProfessionStats } from '../../profession/types/ProfessionStats.types'
import type { Stats } from '../../stats/types/Stats.types'

export interface Character {
  id: string
  name: string
  classId: string
  adventurersGuildRankLevel: number
  level: number
  levelNextXP: number
  xp: number
  stats: Stats
  professions: ProfessionStats
  gold?: number
  createdDate: string
}