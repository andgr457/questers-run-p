import type { CharacterClass } from '../../interfaces/characters/Character.types';

export const CLASS_WARRIOR: CharacterClass = {
  id: 'cc_warrior',
  description: 'A warrior can deal damage solo and optionally tank in a party.',
  name: 'Warrior',
  stats: {
    agility: {
      name: 'AGI',
      value: 1,
      max: 0
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0
    },
    strength: {
      name: 'STR',
      value: 3,
      max: 0
    },
    hp: {
      name: 'HP',
      value: 10,
      max: 0
    },
    mp: {
      name: 'MP',
      value: 1,
      max: 0
    },
    stamina: {
      name: 'STAM',
      value:  10,
      max: 0
    },
  }
}

export const CLASS_HUNTER: CharacterClass = {
  id: 'cc_hunter',
  description: 'A hunter deals ranged damage to enemies and has a high agility',
  name: 'Hunter',
  stats: {
    agility: {
      name: 'AGI',
      value: 3,
      max: 0
    },
    intelligence: {
      name: 'INT',
      value: 1,
      max: 0
    },
    strength: {
      name: 'STR',
      value: 1,
      max: 0
    },
    hp: {
      name: 'HP',
      value: 5,
      max: 0
    },
    mp: {
      name: 'MP',
      value: 5,
      max: 0
    },
    stamina: {
      name: 'STAM',
      value:  15,
      max: 0
    },
  }
}

export const CLASS_MAGE: CharacterClass = {
  id: 'cc_mage',
  description: 'A hunter deals ranged damage to enemies and has a high agility',
  name: 'Mage',
  stats: {
    agility: {
      name: 'AGI',
      value: 1,
      max: 0
    },
    intelligence: {
      name: 'INT',
      value: 3,
      max: 0
    },
    strength: {
      name: 'STR',
      value: 1,
      max: 0
    },
    hp: {
      name: 'HP',
      value: 5,
      max: 0
    },
    mp: {
      name: 'MP',
      value: 15,
      max: 0
    },
    stamina: {
      name: 'STAM',
      value:  5,
      max: 0
    },
  }
}