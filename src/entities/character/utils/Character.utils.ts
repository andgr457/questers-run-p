import type { Character } from '../../../interfaces/Character.types';

export function getCharacterForCreate(): Character {
  return {
    id: `character-${crypto.randomUUID()}`,
    title: '',
    description: '',
    classId: '',
    gold: 250, //to rent building (50), register guild (100), and move in (100)
    guildRole: 'none', //if no characters, this becomes guild master once the guild is setup
    guildId: '',
    level: 1,
    partyId: '',
    professions: [],
    attributes: {
      hp: {
        title: 'HP',
        value: 100,
        valueMax: 100,
        progressBarType: 'drain'
      },
      mana: {
        title: 'MP',
        value: 100,
        valueMax: 100,
        progressBarType: 'drain'
      },
      stamina: {
        title: 'STA',
        value: 100,
        valueMax: 100,
        progressBarType: 'drain'
      },
      xp: {
        title: 'HP',
        value: 0,
        valueMax: 100,
        progressBarType: 'fill'
      }
    }
  }
}