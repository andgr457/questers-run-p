import type { RankLevel } from '../types/Rank.types';

export const GAME_RANK_ICONS: Record<RankLevel, string> = {
  SSS: '☠',
  SS: '☯',
  S: '✪',
  A: '⁂',
  B: '✩',
  C: '⏾',
  D: '⚜',
  E: '⛨',
  F: '⚔'
}

export const GAME_RANK_TITLES: Record<RankLevel, string> = {
  SSS: 'Genesis',
  SS: 'Epoch',
  S: 'Apex',
  A: 'Paragon',
  B: 'Vanguard ',
  C: 'Sentinel',
  D: 'Protector',
  E: 'Laborer',
  F: 'Apprentice'
}

export const GAME_RANK_DESCRIPTIONS: Record<RankLevel, string> = {
  SSS: 'Reserved for threats that can erase entire continents or alter reality. Quests involve primordial gods, world-eating dragons, or planar collapses.',
  SS: 'Covers events threatening the survival of multiple kingdoms or entire races. Quests involve ancient liches, demon lords, or localized apocalypses.',
  S: 'Dictates threats capable of toppling a major superpower or kingdom. Quests involve high dragons, rogue archmages, or massive dungeon breaks.',
  A: 'Represents major military crises affecting large provinces or trading hubs. Quests involve wiping out giant fortresses or hunting minor catastrophes like krakens.',
  B: 'Focuses on localized tactical threats requiring highly specialized combat teams. Quests involve clearing complex mid-tier dungeons or hunting hydras.',
  C: 'The standard benchmark for self-sufficient, fully capable mercenary groups. Quests involve exterminating dangerous monster packs like wyverns or ogres.',
  D: 'Marks the transition from basic town safety to wilderness exploration. Quests involve standard bandit camps, merchant escorts, or basic dungeon scouting.',
  E: 'Handles low-risk problems occurring within or immediately outside city walls. Quests involve clearing giant rats, gathering rare herbs, or hunting lone goblins.',
  F: 'Focuses on zero-combat administrative duties and basic community service. Quests involve finding lost pets, cleaning stables, or delivering local mail.'
}

export const GAME_RANK_SORT: Record<RankLevel, number> = {
  SSS: 0,
  SS: 1,
  S: 2,
  A: 3,
  B: 4,
  C: 5,
  D: 6,
  E: 7,
  F: 8
}