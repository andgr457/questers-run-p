export interface QuestReward {
  xp?: number
  itemId?: string
  itemAmount?: number
  achivementId?: string
}

export interface QuestRewardUI extends QuestReward {
  itemName?: string
  itemAmount?: number
  achievementName?: string
}