import type { PartyRole } from './PartyRole.types'

export interface PartyMember {
  characterId: string
  role: PartyRole
}

export interface PartyEntity {
  id: string
  locationId: string
  name: string
  members: PartyMember[]
}

export interface PartyJoinResponse {
  canJoin: boolean
  cantJoinReason: string
}