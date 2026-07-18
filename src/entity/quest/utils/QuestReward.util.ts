import type { QuestReward } from '../types/QuestReward.types';

export function getQuestRewardGold(gold: number): QuestReward {
  return {
    title: 'Gold',
    gold
  }
}

export function getQuestRewardXP(xp: number): QuestReward {
  return {
    title: 'XP',
    xp
  }
}
