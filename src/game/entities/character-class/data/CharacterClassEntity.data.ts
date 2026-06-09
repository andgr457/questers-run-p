import type { CharacterClassEntity } from '../types/CharacterClassEntity.types';

export const CLASS_WARRIOR: CharacterClassEntity = {
  id: 'cc_warrior',
  description: 'A warrior can deal damage solo and optionally tank in a party.',
  name: 'Warrior',
  agility: 0,
  intellect: 0,
  strength: 2,
}

export const CLASS_HUNTER: CharacterClassEntity = {
  id: 'cc_hunter',
  description: 'A hunter deals ranged damage to enemies and has a high agility.',
  name: 'Hunter',
  agility: 2,
  intellect: 0,
  strength: 0,
}

export const CLASS_ROGUE: CharacterClassEntity = {
  id: 'cc_rogue',
  description: 'A rogue deals melee damage to enemies and has a high agility.',
  name: 'Rogue',
  agility: 2,
  intellect: 0,
  strength: 0,
}

export const CLASS_MAGE: CharacterClassEntity = {
  id: 'cc_mage',
  description: 'A mage deals ranged spell damage to enemies and has a high intellect.',
  name: 'Warrior',
  agility: 0,
  intellect: 2,
  strength: 0,
}

export const CLASS_PRIEST: CharacterClassEntity = {
  id: 'cc_priest',
  description: 'A priest deals ranged spell damage to enemies, heals allies, and has a high intellect.',
  name: 'Priest',
  agility: 0,
  intellect: 2,
  strength: 0,
}

export const GAME_CLASSES: CharacterClassEntity[] = [
  CLASS_WARRIOR,
  CLASS_HUNTER,
  CLASS_ROGUE,
  CLASS_MAGE,
  CLASS_PRIEST,
]