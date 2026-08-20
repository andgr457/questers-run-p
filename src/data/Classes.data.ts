import type { CharacterClass, ClassIds } from '../interfaces/Classes.types';
import { GAME_SKILL_WARRIOR_IDS } from './class-skills/WarriorSkill.data';
export const GAME_CLASS_IDS: Record<ClassIds, ClassIds> = {
  class_warrior: 'class_warrior',
  class_paladin: 'class_warrior',
  class_mage: 'class_warrior',
  class_druid: 'class_warrior',
  class_rogue: 'class_warrior',
  class_hunter: 'class_warrior',
  class_priest: 'class_warrior'
} 

export const GAME_CLASSES: Record<ClassIds, CharacterClass> = {
  class_warrior: {
    id: GAME_CLASS_IDS.class_warrior,
    title: 'Warrior',
    description: 'Warrior description.',
    armorRestrictions: [
      'plate', 'mail'
    ],
    weaponRestrictions: [
      'sword_1h', 'sword_2h',
      'mace_1h', 'mace_2h',
      'shield', 'glaive',
      'dual_weild', 'quarterstaff'
    ],
    partyRoles: ['tank', 'damage'],
    damageTypes: [
      'melee'
    ],
    skillIds: [
      GAME_SKILL_WARRIOR_IDS.warrior_skill_rend,
      GAME_SKILL_WARRIOR_IDS.warrior_skill_shield_bash,
      GAME_SKILL_WARRIOR_IDS.warrior_skill_kick
    ],
    attributesPerLevel: {
      hp: 5,
      mana: 1,
      stamina: 3
    }
  },
  class_paladin: {
    id: GAME_CLASS_IDS.class_paladin,
    title: 'Paladin',
    description: 'Paladin description.',
    armorRestrictions: [
      'plate'
    ],
    weaponRestrictions: [
      'sword_1h', 'sword_2h',
      'mace_1h', 'mace_2h',
      'shield', 'staff'
    ],
    partyRoles: ['tank', 'damage'],
    damageTypes: [
      'melee'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 5,
      mana: 2,
      stamina: 2
    }
  },
  class_mage: {
    id: GAME_CLASS_IDS.class_mage,
    title: 'Mage',
    description: 'Mage description.',
    armorRestrictions: [
      'cloth'
    ],
    weaponRestrictions: [
      'wand', 'focus',
      'staff', 'quarterstaff',
    ],
    partyRoles: ['damage'],
    damageTypes: [
      'spell'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 3,
      mana: 4,
      stamina: 2
    }
  },
  class_druid: {
    id: GAME_CLASS_IDS.class_druid,
    title: 'Druid',
    description: 'Druid description.',
    armorRestrictions: [
      'cloth', 'leather'
    ],
    weaponRestrictions: [
      'staff', 'quarterstaff',
      'mace_1h', 'dagger'
    ],
    partyRoles: ['damage', 'healer'],
    damageTypes: [
      'spell', 'melee'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 3,
      mana: 4,
      stamina: 2
    }
  },
  class_rogue: {
    id: GAME_CLASS_IDS.class_rogue,
    title: 'Rogue',
    description: 'Rogue description.',
    armorRestrictions: [
      'leather'
    ],
    weaponRestrictions: [
      'dagger', 'sword_1h',
      'crossbow', 'dual_weild',
    ],
    partyRoles: ['damage'],
    damageTypes: [
      'melee'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 4,
      mana: 2,
      stamina: 3
    }
  },
  class_hunter: {
    id: GAME_CLASS_IDS.class_hunter,
    title: 'Hunter',
    description: 'Hunter description.',
    armorRestrictions: [
      'leather', 'mail'
    ],
    weaponRestrictions: [
      'dagger', 'sword_1h',
      'crossbow', 'bow',
      'mace_1h', 'quarterstaff',
    ],
    partyRoles: ['damage'],
    damageTypes: [
      'melee', 'ranged'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 3,
      mana: 3,
      stamina: 3
    }
  },
  class_priest: {
    id: GAME_CLASS_IDS.class_priest,
    title: 'Priest',
    description: 'Priest description.',
    armorRestrictions: [
      'cloth'
    ],
    weaponRestrictions: [
      'wand', 'focus',
      'staff', 'quarterstaff',
      'mace_1h', 'dagger',
    ],
    partyRoles: ['healer', 'damage'],
    damageTypes: [
      'spell'
    ],
    skillIds: [],
    attributesPerLevel: {
      hp: 2,
      mana: 4,
      stamina: 3
    }
  }
}