import { GuildRankLevelByRank, GuildRanks } from '../../interfaces/characters/Character.types'
import type { Quest, QuestGroup } from '../../interfaces/quests/Quests.types'
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data'
import { ITEM_FISHING_ITEM_IDS } from '../items/gathering/Item.Fishing.data'
import { ITEM_GATHERING_SMALL_STONE, ITEM_GATHERING_STICK } from '../items/gathering/Item.Gathering.data'

export const QUEST_PROFESSION_IDS = {
  STICKS_N_STONES: 'q_gathering_sticks_stones',
  SPRATS_N_MINNOWS: 'q_fishing_sprats_minnows'
}

const QUEST_GROUP_INTRO_ID = 'qg_professions'

export const QUEST_GROUP_GATHRING: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Profession',
  description: 'Collect resources for the guild and receive rewards.'
}

export const QUEST_GATHERING_STICKS_N_STONES: Quest = {
  id: QUEST_PROFESSION_IDS.STICKS_N_STONES,
  title: 'Sticks & Stones',
  description: 'Gather sticks for firewood and stones for crafters from the woods just outside of the city.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: 3,
  repeatable: true,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 50
    },
    {
      xp: 35
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
    {
      stats: {
        stamina: {
          name: 'STAM',
          value: 20,
          max: 0
        }
      },
      completed: false
    }
  ],
  completionRequirements: [
    {
      itemId: ITEM_GATHERING_STICK.id,
      itemAmount: 15,
      completed: false
    },
    {
      itemId: ITEM_GATHERING_SMALL_STONE.id,
      itemAmount: 15,
      completed: false
    }
  ],
}

export const QUEST_FISHING_SPRATS_N_MINNOWS: Quest = {
  id: QUEST_PROFESSION_IDS.SPRATS_N_MINNOWS,
  title: 'Sprats & Minnows',
  description: 'Fish some sprats and minnows, down by the lake, for the tavern cooks.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: 3,
  repeatable: true,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 60
    },
    {
      xp: 35
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
    {
      stats: {
        stamina: {
          name: 'STAM',
          value: 20,
          max: 0
        }
      },
      completed: false
    }
  ],
  completionRequirements: [
    {
      itemId: ITEM_FISHING_ITEM_IDS.SILVERFIN_SPRAT,
      itemAmount: 10,
      completed: false
    },
    {
      itemId: ITEM_FISHING_ITEM_IDS.MOSSBACK_MINNOW,
      itemAmount: 15,
      completed: false
    }
  ],
}

export const QUEST_PROFESSION_ALL = [
  QUEST_GATHERING_STICKS_N_STONES,
  QUEST_FISHING_SPRATS_N_MINNOWS
]