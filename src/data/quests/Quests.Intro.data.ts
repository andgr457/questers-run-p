import type { Stats } from '../../interfaces/characters/Character.types';
import type { Quest, QuestCompleteProps, QuestGroup } from '../../interfaces/quests/Quests.types';
import { ACHIEVEMENT_INTRO_IDS } from '../achievements/Achievements.Intro.data';
import { CURRENCY_ITEM_IDS } from '../items/currency/Item.Currency.data';

const QUEST_GROUP_INTRO_ID = 'qg_01_intro'
const EMPTY_STATS: Stats = {
  agility: 0,
  hp: 0,
  intelligence: 0,
  mp: 0,
  stamina: 0,
  strength: 0,
}
export const QUEST_GROUP_01_INTRO: QuestGroup = {
  id: QUEST_GROUP_INTRO_ID,
  title: 'Getting Settled',
  description: 'Familiarize yourself with the city and settle into your new home.'
}

export const QUEST_INTRO_IDS = {
  MAIN_CHARACTER_ID: 'q_intro_main_character',
  ADVENTURERS_GUILD_ID: 'q_intro_adventurers_guild'
}

export const QUEST_INTRO_MAIN_CHARACTER: Quest = {
  id: QUEST_INTRO_IDS.MAIN_CHARACTER_ID,
  title: 'Register at the Adventurers Guild',
  description: 'You must register at the adventurers guild before taking anymore quests.',
  groupId: QUEST_GROUP_INTRO_ID,
  requiresLevel: 1,
  requiresQuestId: '',
  questRewardIds: [
    {
      itemId: CURRENCY_ITEM_IDS.GOLD,
      amount: 100
    }
  ],
  maxPartyMembers: 1,
  requiredStats: EMPTY_STATS,
  canComplete: (props: QuestCompleteProps) => {
    if(props.achievementId === ACHIEVEMENT_INTRO_IDS.MAIN_CHARACTER_ID){
      return true
    }
    return false
  }
}

export const QUEST_INTRO_ADVENTURERS_GUILD: Quest = {
  id: QUEST_INTRO_IDS.ADVENTURERS_GUILD_ID,
  title: 'Register at the Adventurers Guild',
  description: 'You must register at the adventurers guild before taking anymore quests.',
  groupId: QUEST_GROUP_INTRO_ID,
  requiresLevel: 1,
  requiresQuestId: QUEST_INTRO_IDS.MAIN_CHARACTER_ID,
  questRewardIds: [
    {
      itemId: CURRENCY_ITEM_IDS.GOLD,
      amount: 100
    }
  ],
  maxPartyMembers: 1,
  requiredStats: EMPTY_STATS,
  canComplete: (props: QuestCompleteProps) => {
    if(props.achievementId === ACHIEVEMENT_INTRO_IDS.ADVENTURERS_GUILD_ID){
      return true
    }
    return false
  }
}