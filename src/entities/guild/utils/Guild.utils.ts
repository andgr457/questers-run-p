import { getBaseEntityAttributes, getBaseEntityStats, getBaseEntityTalents } from '../../entity/utils/Entity.utils';
import { GAME_RANK_SORT } from '../../rank/data/Rank.data';
import { getNewGuildRankRequirements } from '../../rank/utils/Rank.utils';
import type { Guild, GuildUpgrades } from '../types/Guild.types';


export function getBaseGuild(
  title = `Unnamed Guild`,
  description = 'A brand new guild.'
): Guild {
  return {
    id: `guild_${crypto.randomUUID()}`,
    title,
    description,
    attributes: getBaseEntityAttributes(),
    createdDate: 0,
    gold: 0,
    rankLevel: 'F',
    stats: getBaseEntityStats(),
    talents: getBaseEntityTalents(),
    level: 1,
    xp: 0,
    xpNextLevel: 100,
    guildId: '',
    tokens: 0,
    professions: [],
    upgrades: {
      bank: {
        gold: {

        }
      }
    }
  }
}

export function getBaseGuildUpgrades(): GuildUpgrades {
  return {
    bank: {
      gold: {
        title: 'Guild Bank Gold Limit',
        value: 100,
        levelMax: 100,
        levelMultiplier: 1.5,
        requirements: {
          gold:
        }
      }
    }
  }
}