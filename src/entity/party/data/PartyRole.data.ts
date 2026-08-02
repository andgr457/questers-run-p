import type { PartyRole } from '../types/PartyRole.types'

export const GAME_PARTY_ROLE_IDS: PartyRole[] = [
  'tank',
  'healer',
  'damage'
]

export const GAME_PARTY_ROLE_NAMES: Record<PartyRole, string> = {
  tank: 'Tank',
  healer: 'Healer',
  damage: 'Damage'
}

export const GAME_PARTY_ROLE_DESCRIPTIONS: Record<PartyRole, string> = {
  tank: 'Takes attention away from enemies, protecting the party.',
  healer: 'Heals party members during enemy encounters.',
  damage: 'Does large damage to enemies, and can interrupt enemy attacks.'
}