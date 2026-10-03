import { HUD_CLASS_WARRIOR } from './CharacterClass.data';
import type { CharacterClass, CharacterClassId } from './CharacterClass.types';

export const HUD_CLASS_BY_ID: Record<CharacterClassId, CharacterClass> = {
  cl_warrior: HUD_CLASS_WARRIOR
}