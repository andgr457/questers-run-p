import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export const ACHIEVEMENT_GATHERING_IDS = {
  QUEST_TAKE_STICK: 'a_gathering_quest_take_stick',
  STICK_1: 'a_gathering_stick_1',
}

export const ACHIEVEMENT_GATHERING_QUEST_TAKE_STICK: Achievement = {
  id: ACHIEVEMENT_GATHERING_IDS.QUEST_TAKE_STICK,
  title: 'Profession-al',
  description: 'Start your profession journey by taking a profession quest.',
}

export const ACHIEVEMENT_GATHERING_STICK_1: Achievement = {
  id: ACHIEVEMENT_GATHERING_IDS.STICK_1,
  title: 'Stick of Truth',
  description: 'Gathered your first stick.'
}

export const ACHIEVEMENT_GATHERING_ALL: Achievement[] = [
  ACHIEVEMENT_GATHERING_STICK_1,
  ACHIEVEMENT_GATHERING_QUEST_TAKE_STICK
]