import type { QuestEntity } from '../../types/QuestEntity.types';
import { QUEST_GROUP_01_QUESTS } from './QuestGroup01Quests.data';


export const GAME_QUESTS: QuestEntity[] = [
  ...QUEST_GROUP_01_QUESTS,
]