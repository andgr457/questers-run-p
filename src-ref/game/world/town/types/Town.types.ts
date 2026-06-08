import type { Fee } from './TownFees.types'
import type { TownLocation } from './TownLocation.types'

export interface Town {
  id: string
  name: string
  description: string
  fees: Fee[]
  locations: TownLocation[]
}