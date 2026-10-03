import type { Character } from './Character.types';
import { HUD_CLASS_IDS } from './CharacterClass.data';

export function hudCreateCharacter(): Character {
  return {
    id: `c_${crypto.randomUUID()}`,
    name: `Unknown Adventurer`,
    gold: 0,
    xp: 0,
    level: 1,
    classId: HUD_CLASS_IDS.cl_warrior,
    hp: 100,
    mp: 100,
    stamina: 100,
  }
}


