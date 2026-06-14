import { GAME_QUESTS } from '../data/quest/Quests.data';
import type { QuestEntity } from '../types/QuestEntity.types';

export function getQuestsByGroupId(questGroupId: string): QuestEntity[] {
  return GAME_QUESTS.filter(q => q.questGroupId === questGroupId)
}

export function getQuestById(questId: string): QuestEntity | undefined {
  return GAME_QUESTS.find(q => q.id === questId)
}