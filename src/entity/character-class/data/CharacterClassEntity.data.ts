import type { CharacterClassEntity, CharacterClassId } from '../types/CharacterClassEntity.types';

export const CLASS_WARRIOR: CharacterClassEntity = {
  id: 'cc_warrior',
  description: 'A warrior deals melee damage, can tank in a party, and has high strength.',
  name: 'Warrior',
  agility: 0,
  intellect: 0,
  strength: 2,
  roles: ['tank', 'damage']
}

export const CLASS_HUNTER: CharacterClassEntity = {
  id: 'cc_hunter',
  description: 'A hunter deals ranged damage to enemies and has high agility.',
  name: 'Hunter',
  agility: 2,
  intellect: 0,
  strength: 0,
  roles: ['damage']
}

export const CLASS_ROGUE: CharacterClassEntity = {
  id: 'cc_rogue',
  description: 'A rogue deals melee damage to enemies and has high agility.',
  name: 'Rogue',
  agility: 2,
  intellect: 0,
  strength: 0,
  roles: ['damage']
}

export const CLASS_MAGE: CharacterClassEntity = {
  id: 'cc_mage',
  description: 'A mage deals ranged spell damage to enemies and has high intellect.',
  name: 'Mage',
  agility: 0,
  intellect: 2,
  strength: 0,
  roles: ['damage']
}

export const CLASS_PRIEST: CharacterClassEntity = {
  id: 'cc_priest',
  description: 'A priest deals ranged spell damage to enemies, heals allies, and has high intellect.',
  name: 'Priest',
  agility: 0,
  intellect: 2,
  strength: 0,
  roles: ['healer']
}

export const GAME_CHARACTER_CLASSES: Record<CharacterClassId, CharacterClassEntity> = {
  cc_warrior: CLASS_WARRIOR,
  cc_hunter: CLASS_HUNTER,
  cc_mage: CLASS_MAGE,
  cc_priest: CLASS_PRIEST,
  cc_rogue: CLASS_ROGUE
}

export const GAME_CLASSES: CharacterClassEntity[] = [
  CLASS_WARRIOR,
  CLASS_HUNTER,
  CLASS_ROGUE,
  CLASS_MAGE,
  CLASS_PRIEST,
]