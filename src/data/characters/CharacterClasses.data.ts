import type { CharacterClass } from '../../interfaces/characters/Character.types';

export const CLASS_WARRIOR: CharacterClass = {
  id: 'cc_warrior',
  description: 'A warrior can deal damage solo and optionally tank in a party.',
  name: 'Warrior',
  stats: {
    agility: {
      name: 'AGI',
      value: 2,
      hint: ''
    },
    intelligence: {
      name: 'INT',
      value: 1,
      hint: ''
    },
    strength: {
      name: 'STR',
      value: 3,
      hint: ''
    },
    hp: {
      name: 'HP',
      value: 10,
      hint: ''
    },
    mp: {
      name: 'MP',
      value: 1,
      hint: ''
    },
    stamina: {
      name: 'STAM',
      value:  10,
      hint: ''
    },
  }
}