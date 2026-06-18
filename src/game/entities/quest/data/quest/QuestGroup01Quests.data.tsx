import type { QuestEntity } from '../../types/QuestEntity.types';
import { QUEST_GROUP_IDS } from '../quest-groups/QuestGroups.data';

//timer
export const QUEST_GQ_01_TIMER: QuestEntity = {
  id: 'q_qg_1_timer',
  title: <>
   Explore your Surroundings
  </>,
  titleString: 'Explore your Surroundings',
  description: <>
    Explore the town and areas around it.
  </>,
  questGroupId: QUEST_GROUP_IDS.QuestGroup01IntroId,
  repeatable: true,
  rewards: [
    {
      title: 'XP',
      xp: 1,
    },
    {
      title: 'Gold',
      gold: 2
    }
  ],
  requirements: {
    start: [
      {
        title: 'Level',
        level: 1
      },
      {
        title: 'Stamina',
        stamina: 10
      }
    ],
    complete: [
      {
        title: 'Time',
        timeMillis: 15000
      }
    ]
  }
}

export const QUEST_GROUP_01_QUESTS: QuestEntity[] = [
  QUEST_GQ_01_TIMER
]
