import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export const ACHIEVEMENT_INTRO_IDS = {
  MAIN_CHARACTER_ID: 'a_intro_main_character',
  ADVENTURERS_GUILD_ID: 'a_intro_adventurers_guild'
}

export const ACHIEVEMENT_INTRO_MAIN_CHARACTER: Achievement = {
  id: ACHIEVEMENT_INTRO_IDS.MAIN_CHARACTER_ID,
  title: 'isekai\'d',
  description: 'Truck-kun strikes again, transporting you to this realm. Create your new main character.'
}

export const ACHIEVEMENT_INTRO_ADVENTURERS_GUILD: Achievement = {
  id: ACHIEVEMENT_INTRO_IDS.ADVENTURERS_GUILD_ID,
  title: 'F Rank Status',
  description: 'Join the adventurers guild to gain access to sell monster parts, find party members, and complete quests.',
}