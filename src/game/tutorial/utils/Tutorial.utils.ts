import { BASE_TUTORIAL_REWARDS as GAME_BASE_TUTORIAL_REWARDS } from '../data/Tutorial.data';
import type { TutorialReward, TutorialRewardType } from '../types/Tutorial.types';

export function getBaseTutorialRewards(type: TutorialRewardType){
  return {
    type,
    ...GAME_BASE_TUTORIAL_REWARDS
  }
}

function getTutorialRewardValue<
  K extends keyof TutorialReward
>(
  type: TutorialRewardType,
  field: K,
  rewards: TutorialReward[]
): number {
  if (!rewards?.length) return 0

  return rewards
    .filter(r => r.type === type)
    .reduce((acc, reward) => acc + Number(reward[field] ?? 0), 0)
}

export function getTutorialCharacterRewardGold(rewards: TutorialReward[]): number {
  const value = getTutorialRewardValue(
    'character',
    'gold',
    rewards
  )
  return value ?? 0
}

export function getTutorialCharacterRewardXP(rewards: TutorialReward[]): number {
  const value = getTutorialRewardValue(
    'character',
    'xp',
    rewards
  )
  return value ?? 0
}

export function getTutorialPlayerRewardGold(rewards: TutorialReward[]): number {
  const value = getTutorialRewardValue(
    'player',
    'gold',
    rewards
  )
  return value ?? 0
}

export function getTutorialPlayerRewardCharacterTokens(rewards: TutorialReward[]): number {
  const value = getTutorialRewardValue(
    'player',
    'characterTokens',
    rewards
  )
  return value ?? 0
}

export function getTutorialPlayerRewardXP(rewards: TutorialReward[]): number {
  const value = getTutorialRewardValue(
    'player',
    'xp',
    rewards
  )
  return value ?? 0
}