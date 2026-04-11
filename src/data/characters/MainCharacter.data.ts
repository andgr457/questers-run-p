import { DateTime } from 'luxon';
import type { Character } from '../../interfaces/characters/Character.types';
import { CLASS_WARRIOR } from './CharacterClasses.data';

export const CHARACTER_MAIN_DEFAULT: Character =  {
  id: `c_${DateTime.now().toMillis()}`,
  name: 'Hayse',
  achievements: [],
  classId: CLASS_WARRIOR.id,
  level: 1,
  levelNextXP: 100,
  stats: {
    agility: 1,
    hp: 100,
    intelligence: 1,
    mp: 10,
    stamina: 100,
    strength: 1,
  }
}