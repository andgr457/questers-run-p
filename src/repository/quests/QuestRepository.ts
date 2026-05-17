import { QUEST_GATHERING_ALL } from '../../data/quests/Quests.Gathering.data';
import { QUEST_INTRO_ALL } from '../../data/quests/Quests.Intro.data';
import type { Quest } from '../../interfaces/quests/Quests.types';

export class QuestRepository {
  
  async list(): Promise<Quest[]> {
    return [
      ...QUEST_INTRO_ALL,
      ...QUEST_GATHERING_ALL,
      
    ]
  }
}