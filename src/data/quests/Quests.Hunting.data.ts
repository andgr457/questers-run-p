import { GuildRankLevelByRank, GuildRanks } from '../../interfaces/characters/Character.types'
import type { Quest, QuestGroup } from '../../interfaces/quests/Quests.types'
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data'
import { MOB_SLIME_IDS } from '../mobs/Mobs.Slimes.data'

export const QUEST_HUNTING_IDS = {
  SLIMES_GREEN: 'q_hunting_slimes_green'
}

const QUEST_GROUP_INTRO_ID = 'qg_hunting'

export const QUEST_GROUP_HUNTING: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Hunting',
  description: 'Hunt creatures for the guild to receive rewards.'
}

export const QUEST_HUNTING_SLIMES_GREEN: Quest = {
  id: QUEST_HUNTING_IDS.SLIMES_GREEN,
  title: 'Slide on Green Slimes',
  description: 'Slide on some green slimes in the nearby forrest.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: 3,
  repeatable: true,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 25
    },
    {
      xp: 20
    }
  ],
  startRequirements: [
    {
      level: 1,
      completed: false,
    },
    {
      guildRankLevel: GuildRankLevelByRank[GuildRanks.F],
      completed: false
    },
  ],
  completionRequirements: [
    {
      mobId: MOB_SLIME_IDS.GREEN_SMALL,
      mobAmount: 5,
      completed: false
    }
  ],
}

export const QUEST_HUNTING_ALL = [
  QUEST_HUNTING_SLIMES_GREEN
]