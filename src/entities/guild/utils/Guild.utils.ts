import type { Guild } from '../types/Guild.types';

export function getNewGuild(): Guild {
  return {
    id: `guild_${crypto.randomUUID()}`,
    name: 'My Guild',
    level: 1,
    gold: 100,
    xp: 0,
    xpNextLevel: 100,
    upgrades: {
      maxCharacters: {
        title: 'Guild Max Characters',
        description: 'Increases the max amount of characters the guild can hire.',
        level: 1,
        maxLevel: 10,
        value: 1,
        cost: {
          base: 150,
          levelMultiplier: 1.75
        }
      },
      maxGold: {
        title: 'Guild Max Gold',
        description: 'Increases the max amount of gold the guild can have at one time.',
        level: 1,
        maxLevel: 10,
        value: 150,
        cost: {
          base: 25,
          levelMultiplier: 1.5
        }
      },
      maxLevel: {
        title: 'Guild Max Level',
        description: 'Increases the max level the guild can achieve.',
        level: 1,
        maxLevel: 10,
        value: 1,
        cost: {
          base: 200,
          levelMultiplier: 1.5
        }
      }
    }
  }
}