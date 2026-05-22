import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export const ACHIEVEMENT_HUNTING_IDS = {
  SLIME_GREEN_SMALL: 'a_hunting_slime_green_small_5',
}

export const ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_5: Achievement = {
  id: ACHIEVEMENT_HUNTING_IDS.SLIME_GREEN_SMALL,
  title: 'Slimed the Small Slimes',
  description: 'Defeat 5 small green slimes in the forest.'
}

export const ACHIEVEMENT_HUNTING_ALL: Achievement[] = [
  ACHIEVEMENT_HUNTING_SLIME_GREEN_SMALL_5,
]