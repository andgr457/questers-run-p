import { QUEST_GROUP_01_INTRO } from '../../data/quests/Quests.Intro.data';
import type { QuestGroup } from '../../interfaces/quests/Quests.types';

export class QuestGroupRepository {

  async list(): Promise<QuestGroup[]>{
    return [
      QUEST_GROUP_01_INTRO
    ]
  }
}