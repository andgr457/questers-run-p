import { BASE_TUTORIAL_REWARDS as GAME_BASE_TUTORIAL_REWARDS } from '../data/Tutorial.data';
import type { TutorialRewardType } from '../types/Tutorial.types';

export function getBaseTutorialRewards(type: TutorialRewardType){
  return {
    type,
    ...GAME_BASE_TUTORIAL_REWARDS
  }
}