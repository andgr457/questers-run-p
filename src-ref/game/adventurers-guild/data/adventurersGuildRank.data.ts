import type { AdventurersGuildRankLabel } from '../types/AdventurersGuildRank.types'

export const ADVENTURERS_GUILD_RANK_LEVEL: Record<AdventurersGuildRankLabel, number> = {
  '': 0,
  F: 1,
  E: 2,
  D: 3,
  C: 4,
  B: 5,
  A: 6,
  S: 7,
  SS: 8
}

export const ADVENTURERS_GUILD_RANK_LABEL: Record<string, AdventurersGuildRankLabel> = {
  '0': '',
  '1': 'F',
  '2': 'E',
  '3': 'D',
  '4': 'C',
  '5': 'B',
  '6': 'A',
  '7': 'S',
  '8': 'SS',
}
