import type { Quest, QuestCompleteProps, QuestGroup } from '../../interfaces/quests/Quests.types'
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data'
import { ITEM_GATHERING_SMALL_STONE, ITEM_GATHERING_STICK } from '../items/gathering/Item.Gathering.data'
import { EMPTY_STATS } from '../Stats.data'
import { QUEST_INTRO_IDS } from './Quests.Intro.data'

export const QUEST_GATHERING_IDS = {
  STICKS_N_STONES: 'q_gathering_sticks_stones'
}

const QUEST_GROUP_INTRO_ID = 'qg_gathering'

export const QUEST_GROUP_GATHRING: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Adventurers Guild Gathering',
  description: 'Collect resources for the guild and receive rewards for requested items!'
}

export const QUEST_GATHERING_STICKS: Quest = {
  id: QUEST_GATHERING_IDS.STICKS_N_STONES,
  title: 'Sticks & Stones',
  description: 'Gather sticks and stones from the woods just outside of the city.',
  groupId: QUEST_GROUP_INTRO_ID,
  requiredLevel: 1,
  requiredQuestId: QUEST_INTRO_IDS.ADVENTURERS_GUILD_ID,
  cooldownMinutes: 3,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 100
    }
  ],
  requirements: [
    {
      itemId: ITEM_GATHERING_STICK.id,
      itemAmount: 24
    },
    {
      itemId: ITEM_GATHERING_SMALL_STONE.id,
      itemAmount: 12
    },
    {
      timeMinutes: 1
    }
  ],
  maxPartyMembers: 1,
  requiredStats: EMPTY_STATS,
}