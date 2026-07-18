

import { GAME_ITEMS_BERRY_IDS } from '../../item/data/ItemBerries.data';
import type { QuestEntity } from '../types/QuestEntity.types';
import { getQuestCompleteGatherItemQty } from '../utils/QuestCompleteRequirement.utils';
import { getQuestRewardGold, getQuestRewardXP } from '../utils/QuestReward.util';
import { getQuestStartRequirementLevel, getQuestStartRequirementStamina } from '../utils/QuestStartRequirement.utils';

export const GAME_QUESTS_ORON_IDS = {
  Q_01_GATHER_BERRIES: 'q_01_gather_berries',
}

const Q_01_GATHER_BERRIES: QuestEntity = {
  id: GAME_QUESTS_ORON_IDS.Q_01_GATHER_BERRIES,
  title: 'Gather Berries',
  description: 'The local inn needs someone to gather berries in the plains outside of town as the stock is getting low.',
  repeatable: true,
  requirements: {
    start: [
      getQuestStartRequirementLevel(1),
      getQuestStartRequirementStamina(10)
    ],
    complete: [
      getQuestCompleteGatherItemQty(
        GAME_ITEMS_BERRY_IDS.BERRY_BLUE,
        25
      )
    ]
  },
  rewards: [
    getQuestRewardGold(30),
    getQuestRewardXP(30)
  ]
}

export const GAME_QUESTS_ORON: QuestEntity[] = [
  Q_01_GATHER_BERRIES,
]

