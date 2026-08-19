import type { GuildRankRequirements } from '../../guild/types/Guild.types';
import { GAME_RANK_DESCRIPTIONS, GAME_RANK_ICONS, GAME_RANK_SORT, GAME_RANK_TITLES } from '../data/Rank.data';
import type { GuildRank, RankLevel } from '../types/Rank.types';

export function getNewGuildRankRequirements(rankSort: number): GuildRankRequirements {
  return {
    achievements: Math.ceil(1 + (2.5 * rankSort)),
    dungeons: Math.ceil(1 + (1.5 * rankSort)),
    level: Math.ceil(5 + (5 * rankSort)),
    members: Math.ceil(2 + (2 * rankSort)),
    memberLevels: Math.ceil(5 + (10 * rankSort)),
    quests: Math.ceil(10 + (10 * rankSort)),
    raids: Math.ceil(1 + (0.5 * rankSort))
  }
}

export function getGuildRanks(): GuildRank[] {
  const ranks: GuildRank[] = []
  const gameRanks = Object.getOwnPropertyNames(GAME_RANK_TITLES) as RankLevel[]

  for(const property of gameRanks){
    const rankSort = GAME_RANK_SORT[property]

    ranks.push({
      id: crypto.randomUUID(),
      description: GAME_RANK_DESCRIPTIONS[property],
      icon: GAME_RANK_ICONS[property],
      rankLevel: property,
      requirements: getNewGuildRankRequirements(rankSort),
      title: GAME_RANK_TITLES[property]
    })
  }

  return ranks
}