import { CLASS_HUNTER, CLASS_MAGE, CLASS_WARRIOR } from '../../data/characters/CharacterClasses.data';
import type { CharacterClass } from '../../interfaces/characters/Character.types';

export class CharacterClassRepository {
  
  async list(): Promise<CharacterClass[]> {
    return [
      CLASS_WARRIOR,
      CLASS_HUNTER,
      CLASS_MAGE
    ]
  }
}