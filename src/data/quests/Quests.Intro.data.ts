import type { Quest, QuestGroup } from '../../interfaces/quests/Quests.types';
import { ACHIEVEMENT_INTRO_IDS } from '../achievements/Achievements.Intro.data';
import { ITEM_CURRENCY_IDS } from '../items/currency/Item.Currency.data';

export const QUEST_COOLDOWNS = {
  NOT_REPEATABLE: -1,
}

const QUEST_GROUP_INTRO_ID = 'qg_intro'

export const QUEST_GROUP_INTRO: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Getting Settled',
  description: 'Familiarize yourself with the town and settle into your new home.'
}

export const QUEST_INTRO_IDS = {
  ADVENTURERS_GUILD_ID: 'q_intro_adventurers_guild',
  MERCHANT_FAVOR_ID: 'q_intro_merchant_favor',
  SWEEP_STREETS: 'q_intro_sweep_streets'
}

export const QUEST_INTRO_ADVENTURERS_GUILD: Quest = {
  id: QUEST_INTRO_IDS.ADVENTURERS_GUILD_ID,
  title: 'Register at the Adventurer\'s Guild',
  description: 'Register with the adventurer\'s guild to get your adventurers license so you can take quests and sell specialty items.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: QUEST_COOLDOWNS.NOT_REPEATABLE,
  repeatable: false,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 5
    },
    {
      xp: 5
    }
  ],
  startRequirements: [
    {
      level: 1,
      completed: false,
    }
  ],
  completionRequirements: [
    {
      achievementId: ACHIEVEMENT_INTRO_IDS.ADVENTURERS_GUILD_ID,
      completed: false
    }
  ]
}

export const QUEST_INTRO_MERCHANT_FAVOR: Quest = {
  id: QUEST_INTRO_IDS.MERCHANT_FAVOR_ID,
  title: 'Merchant Favor',
  description: 'The adventurer\'s guild merchant Shan needs someone to bring goods to the neighboring village.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: 10,
  repeatable: true,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 10
    },
    {
      xp: 20
    }
  ],
  startRequirements: [
    {
      level: 2,
      completed: false,
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
      timeMinutes: 1,
      completed: false
    }
  ]
}

export const QUEST_INTRO_SWEEP_STREETS: Quest = {
  id: QUEST_INTRO_IDS.SWEEP_STREETS,
  title: 'Sweep Streets',
  description: 'Sweep the streets of the town for some easy gold.',
  groupId: QUEST_GROUP_INTRO_ID,
  cooldownMinutes: 10,
  repeatable: true,
  rewards: [
    {
      itemId: ITEM_CURRENCY_IDS.GOLD,
      itemAmount: 5
    },
    {
      xp: 5
    }
  ],
  startRequirements: [
    {
      level: 1,
      completed: false,
    },
  ],
  completionRequirements: [
    {
      timeMinutes: 0.5,
      completed: false
    }
  ]
}

export const QUEST_INTRO_ALL = [
  QUEST_INTRO_ADVENTURERS_GUILD,
  QUEST_INTRO_MERCHANT_FAVOR,
  QUEST_INTRO_SWEEP_STREETS
]