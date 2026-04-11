import { QUEST_GATHERING_STICKS_N_STONES } from '../../data/quests/Quests.Gathering.data';
import { QUEST_INTRO_ADVENTURERS_GUILD } from '../../data/quests/Quests.Intro.data';
import type { Quest } from '../../interfaces/quests/Quests.types';

export class QuestRepository {
  
  async list(): Promise<Quest[]> {
    return [
      QUEST_INTRO_ADVENTURERS_GUILD,
      QUEST_GATHERING_STICKS_N_STONES,

    ]
  }
}