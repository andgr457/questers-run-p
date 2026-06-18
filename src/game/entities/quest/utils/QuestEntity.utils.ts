import { GAME_QUEST_GROUPS } from '../data/quest-groups/QuestGroups.data';
import { GAME_QUESTS } from '../data/quest/Quests.data';
import type { QuestEntity } from '../types/QuestEntity.types';
import type { QuestGroupEntity } from '../types/QuestGroupEntity.types';

export function getQuestGroupById(questGroupId: string): QuestGroupEntity | undefined {
  return GAME_QUEST_GROUPS.find(qg => qg.id === questGroupId)
}

export function getQuestsByGroupId(questGroupId: string): QuestEntity[] {
  return GAME_QUESTS.filter(q => q.questGroupId === questGroupId)
}

export function getQuestById(questId: string): QuestEntity | undefined {
  return GAME_QUESTS.find(q => q.id === questId)
}