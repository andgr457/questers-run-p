import type { CharacterClass, CharacterClassId } from './CharacterClass.types';

export const HUD_CLASS_IDS: Record<CharacterClassId, CharacterClassId> = {
  cl_warrior: 'cl_warrior',
}

export const HUD_CLASS_WARRIOR: CharacterClass = {
  id: 'cl_warrior',
  name: 'Warrior',
  description: 'Close quarters combat adventurer.'
}