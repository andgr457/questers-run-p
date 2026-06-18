//01 Introduction Quests

import type { QuestGroupEntity } from '../../types/QuestGroupEntity.types';

export const QUEST_GROUP_IDS = {
  QuestGroup01IntroId: 'gq_1'
}

export const QUEST_GROUP_01_INTRO: QuestGroupEntity = {
  id: QUEST_GROUP_IDS.QuestGroup01IntroId,
  title: <>
    <span style={{color: 'gold'}}>G1.</span> Introduction
  </>,
  titleString: 'G1. Introduction',
  description: <>
    <strong>Starter</strong> quests to familiarize yourself with the different completion requirements.
  </>
}


export const GAME_QUEST_GROUPS: QuestGroupEntity[] = [
  QUEST_GROUP_01_INTRO,
]