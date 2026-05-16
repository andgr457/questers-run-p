import { DateTime } from 'luxon';
import type { Character } from '../../interfaces/characters/Character.types';
import { CLASS_WARRIOR } from './CharacterClasses.data';

export const CHARACTER_MAIN_DEFAULT: Character =  {
  id: `c_${DateTime.now().toMillis()}`,
  name: '',
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
      level: 1,
      max: 100
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
      level: 1,
      max: 10
    },
    stamina: {
      name: 'STAM',
      value: 100,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1,
      max: 100
    },
    strength: {
      name: 'STR',
      value: 1,
      hint: '',
      xp: 0,
      nextLevelXP: 100,
      level: 1
    },
  },
  professions: {
    gathering: {
      name: 'Gathering',
      hint: '',
      value: 0,
      level: 0,
      nextLevelXP: 100,
      xp: 0,
    },
    mining: {
      name: 'Mining',
      hint: '',
      value: 0,
      level: 0,
      nextLevelXP: 100,
      xp: 0,
    },
    fishing: {
      name: 'Fishing',
      hint: '',
      value: 0,
      level: 0,
      nextLevelXP: 100,
      xp: 0,
    },
  }
}