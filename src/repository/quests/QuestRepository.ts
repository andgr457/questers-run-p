import { QUEST_INTRO_ADVENTURERS_GUILD } from '../../data/quests/Quests.Intro.data';
import type { Quest } from '../../interfaces/quests/Quests.types';

export class QuestRepository {

  async list(): Promise<Quest[]> {
    return [
      QUEST_INTRO_ADVENTURERS_GUILD
    ]
  }
}