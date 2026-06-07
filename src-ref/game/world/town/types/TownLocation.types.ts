import type { Fee } from './TownFees.types'

export type TownLocationType = 'tavern'
  | 'adventurers_guild'
  | 'market'
  | 'blacksmith'
  | 'church'
  | 'library'
  | 'castle'
  | 'college'
  | 'workshop'


export interface TownLocation {
  id: string
  name: string
  type: TownLocationType
  fees: Fee[]
}