import { DateTime } from 'luxon';
import type { Character } from '../../interfaces/characters/Character.types';
import { CLASS_WARRIOR } from './CharacterClasses.data';

export const CHARACTER_MAIN_DEFAULT: Character =  {
  id: `c_${DateTime.now().toMillis()}`,
  name: 'Hayse',
  achievements: [],
  classId: CLASS_WARRIOR.id,
  level: 1,
  xp: 0,
  levelNextXP: 100,
  guildRank: '',
  stats: {
    agility: {
      name: 'AGI',
      value: 1,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
    hp: {
      name: 'HP',
      value: 100,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
    intelligence: {
      name: 'INT',
      value: 1,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
    mp: {
      name: 'MP',
      value: 10,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
    stamina: {
      name: 'STAM',
      value: 100,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
    strength: {
      name: 'STR',
      value: 1,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
  }
}