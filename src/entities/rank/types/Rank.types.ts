import type { GuildRankRequirements } from '../../guild/types/Guild.types'

export type RankLevel = 
  'SSS'
  | 'SS'
  | 'S'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'

interface RankRequiredProperty {
  baseValue: number
  valueMultiplier: number
}

export interface Rank {
  id: string
  title: string
  description: string
  rankLevel: RankLevel
  icon: string
}

export interface GuildRank extends Rank {
  requirements: GuildRankRequirements
}