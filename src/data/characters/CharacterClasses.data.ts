import type { CharacterClass } from '../../interfaces/characters/Character.types';

export const CLASS_WARRIOR: CharacterClass = {
  id: 'cc_warrior',
  description: 'A warrior can deal damage solo and optionally tank in a party.',
  name: 'Warrior',
  stats: {
    agility: 2,
    intelligence: 1,
    strength: 3,
    hp: 10,
    mp: 0,
    stamina: 10,
  }
}