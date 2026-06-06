import type { Attribute } from '../../attribute/types/Attribute.types'
import type { Stats } from '../../stats/types/Stats.types'

export interface CharacterClass {
  id: string
  name: string
  description: string
  stats: Partial<Stats>
  attributes: Partial<Attribute>
}
