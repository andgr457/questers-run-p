import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export const ACHIEVEMENT_HUNTING_IDS = {
  SLIME_GREEN_SMALL_1: 'a_hunting_slime_green_small_1',
  TAKE_QUEST_SLIME_GREEN_SMALL: 'a_hunting_quest_take_slime_green_small_',
}

export const ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_TAKE_QUEST: Achievement = {
  id: ACHIEVEMENT_HUNTING_IDS.TAKE_QUEST_SLIME_GREEN_SMALL,
  title: 'Hunted',
  description: 'Start your hunter journey by taking a hunter quest.'
}

export const ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_1: Achievement = {
  id: ACHIEVEMENT_HUNTING_IDS.SLIME_GREEN_SMALL_1,
  title: 'Slimed a Small Slime',
  description: 'Defeated a small green slime in the forest.'
}

export const ACHIEVEMENT_HUNTING_ALL: Achievement[] = [
  ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_1,
  ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_TAKE_QUEST,
]