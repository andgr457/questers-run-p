//01 Introduction Quests

import type { QuestGroupEntity } from '../../types/QuestGroupEntity.types';

export const QUEST_GROUP_IDS = {
  QuestGroup01IntroId: 'gq_1'
}

export const QUEST_GROUP_01_INTRO: QuestGroupEntity = {
  id: QUEST_GROUP_IDS.QuestGroup01IntroId,
  title: <>
    Introduction
  </>,
  description: <>
    Starter quests to familiarize yourself with the different completion requirements.
  </>
}


export const GAME_QUEST_GROUPS: QuestGroupEntity[] = [
  QUEST_GROUP_01_INTRO,
]