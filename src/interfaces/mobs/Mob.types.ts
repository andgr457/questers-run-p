import type { Stats } from '../characters/Character.types'
import type { Item } from '../items/Item.types'

export interface Loot {
  itemId: string
  itemAmount: number
  chance: number
  characterRoll?: number
  item?: Item
}

export type MobLocationType = 'forest' |
'mines' |
'lake'

export interface Mob {
  id: string
  name: string
  description: string
  guildRankLevel: number
  level: number
  xp: number
  location: MobLocationType
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