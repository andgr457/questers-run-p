import { QUEST_GROUP_GATHRING } from '../../data/quests/Quests.Gathering.data';
import { QUEST_GROUP_INTRO } from '../../data/quests/Quests.Intro.data';
import type { QuestGroup } from '../../interfaces/quests/Quests.types';

export class QuestGroupRepository {

  async list(): Promise<QuestGroup[]>{
    return [
      QUEST_GROUP_INTRO,
      QUEST_GROUP_GATHRING,
      
    ]
  }
}