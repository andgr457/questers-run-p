export interface CharacterClassEntity {
  id: CharacterClassId
  name: string
  description: string
  strength: number
  intellect: number
  agility: number
}

export type CharacterClassId = 'cc_warrior'
  | 'cc_hunter'
  | 'cc_rogue'
  | 'cc_mage'
  | 'cc_priest'