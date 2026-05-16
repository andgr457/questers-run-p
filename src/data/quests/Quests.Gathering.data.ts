import type { Quest, QuestGroup } from '../../interfaces/quests/Quests.types'
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data'
import { ITEM_GATHERING_SMALL_STONE, ITEM_GATHERING_STICK } from '../items/gathering/Item.Gathering.data'
import { QUEST_INTRO_IDS } from './Quests.Intro.data'

export const QUEST_GATHERING_IDS = {
  STICKS_N_STONES: 'q_gathering_sticks_stones'
}

const QUEST_GROUP_INTRO_ID = 'qg_gathering'

export const QUEST_GROUP_GATHRING: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Gathering',
  description: 'Gather resources for the guild to receive rewards.'
}

export const QUEST_GATHERING_STICKS_N_STONES: Quest = {
  id: QUEST_GATHERING_IDS.STICKS_N_STONES,
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
      xp: 10
    }
  ],
  startRequirements: [
    {
      level: 1,
      completed: false,
    },
    {
      questId: QUEST_INTRO_IDS.ADVENTURERS_GUILD_ID,
      completed: false
    },
    {
      stats: {
        stamina: {
          name: 'Stamina',
          value: 10,
          hint: ''
        }
      },
      completed: false
    }
  ],
  completionRequirements: [
    {
      itemId: ITEM_GATHERING_STICK.id,
      itemAmount: 24,
      completed: false
    },
    {
      itemId: ITEM_GATHERING_SMALL_STONE.id,
      itemAmount: 12,
      completed: false
    }
  ],
}

export const QUEST_GATHERING_ALL = [
  QUEST_GATHERING_STICKS_N_STONES
]