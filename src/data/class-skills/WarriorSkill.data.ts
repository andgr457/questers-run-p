import type { WarriorSkillIds } from '../../interfaces/class-skills/WarriorSkill.types';
import type { Skill } from '../../interfaces/Skill.types';

export const GAME_SKILL_WARRIOR_IDS: Record<WarriorSkillIds, WarriorSkillIds> = {
  warrior_skill_rend: 'warrior_skill_rend',
  warrior_skill_shield_bash: 'warrior_skill_rend',
  warrior_skill_kick: 'warrior_skill_rend',
}

export const GAME_SKILLS_WARRIOR: Record<WarriorSkillIds, Skill> = {
  warrior_skill_rend: {
    id: GAME_SKILL_WARRIOR_IDS.warrior_skill_rend,
    title: 'Rend',
    description: 'Wound the target, causing it to bleed for a short time. Does not stack.',
    cast: 750, //ms
    cooldown: 15000,
    level: 1,
    levelRequired: 1,
    xp: {
      title: 'XP',
      value: 0,
      valueMax: 100,
      progressBarType: 'fill'
    },
    applications: {
      base: 'melee:target',
      elements: ['physical'],
      self: {
        hp: 0,
        mana: 0,
        stamina: 1
      },
      target: {
        hp: 2,
        mana: 0,
        stamina: 0,
        bleed: 10000,
        interrupt: false,
        poison: 0,
        stun: 0
      }
    }
  },
  warrior_skill_shield_bash: {
    id: GAME_SKILL_WARRIOR_IDS.warrior_skill_shield_bash,
    title: 'Shield Bash',
    description: 'Bashes targets with your shield, stunning them for a short time.',
    cast: 500, //ms
    cooldown: 10000,
    level: 1,
    levelRequired: 1,
    xp: {
      title: 'XP',
      value: 0,
      valueMax: 100,
      progressBarType: 'fill'
    },
    applications: {
      base: 'melee:aoe',
      elements: ['physical'],
      self: {
        hp: 0,
        mana: 0,
        stamina: 3
      },
      target: {
        hp: 1,
        mana: 0,
        stamina: 0,
        bleed: 0,
        interrupt: true,
        poison: 0,
        stun: 2000
      }
    }
  },
  warrior_skill_kick: {
    id: GAME_SKILL_WARRIOR_IDS.warrior_skill_kick,
    title: 'Kick',
    description: 'Kicks the target with your shield, interrupting any casting for a short time.',
    cast: 250, //ms
    cooldown: 10000,
    level: 1,
    levelRequired: 1,
    xp: {
      title: 'XP',
      value: 0,
      valueMax: 100,
      progressBarType: 'fill'
    },
    applications: {
      base: 'melee:target',
      elements: ['physical'],
      self: {
        hp: 0,
        mana: 0,
        stamina: 5
      },
      target: {
        hp: 2,
        mana: 0,
        stamina: 0,
        bleed: 0,
        interrupt: true,
        poison: 0,
        stun: 2000
      }
    }
  },
}