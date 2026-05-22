import type { Stats } from '../characters/Character.types'

export interface Loot {
  itemId: string
  itemAmount: number
  chance: number
}

export type LocationType = 'forest' |
'mines' |
'lake'

export interface Mob {
  id: string
  name: string
  description: string
  guildRankLevel: number
  level: number
  xp: number
  location: LocationType
  stats: Stats
  loot: Loot[]
}

export interface MobProgress {
  id: string
  characterId: string
  questProgressId?: string
  mobId: string
  defeatedDate: string
}