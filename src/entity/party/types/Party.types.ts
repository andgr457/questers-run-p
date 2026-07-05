export type PartyRole = 'tank' | 'healer' | 'damage'

export const GAME_PARTY_ROLE_NAMES: Record<PartyRole, string> = {
  tank: 'Tank',
  healer: 'Healer',
  damage: 'Damage'
}

export const GAME_PARTY_ROLE_DESCRIPTIONS: Record<PartyRole, string> = {
  tank: '',
  healer: '',
  damage: ''
}