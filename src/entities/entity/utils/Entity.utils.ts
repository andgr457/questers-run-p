import type { EntityBaseAttributes, EntityBaseStats, EntityBaseTalents, EntityProperty } from '../types/Entity.types';
import { 
  GAME_ATTRIBUTE_AGILITY, 
  GAME_ATTRIBUTE_HP, 
  GAME_ATTRIBUTE_INTELLECT, 
  GAME_ATTRIBUTE_MANA, 
  GAME_ATTRIBUTE_STAMINA, 
  GAME_ATTRIBUTE_STRENGTH
} from '../data/EntityAttributes.data';
import { GAME_STATS_BASE } from '../data/EntityStatistics.data';

export function getBaseEntityAttributes(): EntityBaseAttributes {
  return {
    agility: GAME_ATTRIBUTE_AGILITY,
    intellect: GAME_ATTRIBUTE_INTELLECT,
    strength: GAME_ATTRIBUTE_STRENGTH,
    hp: GAME_ATTRIBUTE_HP,
    stamina: GAME_ATTRIBUTE_STAMINA,
    mana: GAME_ATTRIBUTE_MANA,
  }
}

export function getBaseEntityStats(): EntityBaseStats {
  return {
    ...GAME_STATS_BASE
  }
}

export function getBaseEntityTalents(): EntityBaseTalents {
  return {
    criticals: {
      melee: {
        chance: 0,
        value: 0,
        type: 'melee',
        title: 'Melee Critical Chance/Damage'
      },
      spell: {
        chance: 0,
        value: 0,
        type: 'spell',
        title: 'Spell Critical Chance/Damage'
      },
      block: {
        chance: 0,
        value: 0,
        type: 'block',
        title: 'Block Chance/Damage Mitigation'
      },
      evade: {
        chance: 0,
        value: 0,
        type: 'evade',
        title: 'Evade Critical Chance/Damage Mitigation'
      }
    }
  }
}
