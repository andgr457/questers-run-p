import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export const ACHIEVEMENT_INTRO_IDS = {
  MAIN_CHARACTER_ID: 'a_intro_main_character',
  ADVENTURERS_GUILD_ID: 'a_intro_adventurers_guild',
  ADVENTURERS_GUILD_COMPLETE_ID: 'a_intro_adventurers_guild_complete',

}

export const ACHIEVEMENT_INTRO_MAIN_CHARACTER: Achievement = {
  id: ACHIEVEMENT_INTRO_IDS.MAIN_CHARACTER_ID,
  title: 'isekai\'d',
  description: 'Truck-kun strikes again, transporting you to this realm. Create your new main character.'
}

export const ACHIEVEMENT_INTRO_ADVENTURERS_GUILD: Achievement = {
  id: ACHIEVEMENT_INTRO_IDS.ADVENTURERS_GUILD_ID,
  title: 'F Rank Status',
  description: 'Join the adventurer\'s guild to get a license to quests, find party members, and defense missions.',
}

export const ACHIEVEMENT_INTRO_ADVENTURERS_GUILD_COMPLETE: Achievement = {
  id: ACHIEVEMENT_INTRO_IDS.ADVENTURERS_GUILD_COMPLETE_ID,
  title: 'First Quest',
  description: 'Completed the "Register at the Adventurer\'s Guild quest.',
}

export const ACHIEVEMENT_INTRO_ALL: Achievement[] = [
  ACHIEVEMENT_INTRO_MAIN_CHARACTER,
  ACHIEVEMENT_INTRO_ADVENTURERS_GUILD,
  ACHIEVEMENT_INTRO_ADVENTURERS_GUILD_COMPLETE,
]