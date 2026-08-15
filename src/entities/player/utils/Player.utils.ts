import type { Player } from '../types/Player.types';

export function getNewPlayer(): Player {
  return {
    id: `player_${crypto.randomUUID()}`,
    name: 'Guild Master',
    gold: 0,
    level: 1,
    xp: 0,
    xpNextLevel: 100,
    stamina: 100,
    staminaMax: 100,
    tokens: 0,
    upgrades: {
      goldPerQuest: {
        title: 'Player Quest Gold',
        description: 'Increases the gold gained by the player and all characters once a character completes a quest.',
        level: 1,
        maxLevel: 10,
        value: 1,
        cost: {
          base: 50,
          levelMultiplier: 1.5
        }
      },
      speedPerQuest: {
        title: 'Player Quest Speed',
        description: 'Increases the quest speed completion of all characters.',
        level: 1,
        maxLevel: 10,
        value: 1,
        cost: {
          base: 50,
          levelMultiplier: 1.5
        }
      },
      xpPerQuest: {
        title: 'Player Quest XP',
        description: 'Increases the xp gained by the player and all characters once a character completes a quest.',
        level: 1,
        maxLevel: 10,
        value: 1,
        cost: {
          base: 50,
          levelMultiplier: 1.5
        }
      }
    }
  }
}