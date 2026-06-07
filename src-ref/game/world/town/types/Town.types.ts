import type { Fee } from './TownFees.types'

export interface Town {
  id: string
  name: string
  description: string
  fees: Fee[]
}