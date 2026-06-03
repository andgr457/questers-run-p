import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Quest, QuestRewardUI } from '../../../interfaces/quests/Quests.types'

export function buildQuestRewardsUI(params: {
  quest: Quest
  items: Item[]
  achievements: Achievement[]
}): QuestRewardUI[] {
  const { quest, items, achievements } = params

  const rewards: QuestRewardUI[] = []

  for (const reward of quest.rewards) {
    if (reward.xp) {
      rewards.push({ xp: reward.xp })
    }

    if (reward.itemId) {
      const item = items.find(i => i.id === reward.itemId)

      rewards.push({
        itemId: reward.itemId,
        itemName: item?.name,
        itemAmount: reward.itemAmount,
      })
    }

    if (reward.achivementId) {
      const achievement = achievements.find(
        a => a.id === reward.achivementId,
      )

      rewards.push({
        achievementId: reward.achivementId,
        achievementTitle: achievement?.title,
      })
    }
  }

  return rewards
}