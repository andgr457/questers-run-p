export type EncounterType =
  | 'hunting'
  | 'gathering'
  | 'scouting'
  | 'dungeon'
  | 'raid'

export type EncounterStatus =
  | 'active'
  | 'completed'
  | 'cancelled'

export interface EncounterRuntimeEntry {
  id: string

  type: EncounterType

  characterId: string

  startedAt: number

  status: EncounterStatus

  // optional metadata for debugging / UI
  meta?: {
    mobId?: string
    locationId?: string
  }
}