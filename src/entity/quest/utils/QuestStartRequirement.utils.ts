import type { QuestRequirementStart } from '../types/QuestRequirement.type';

export function getQuestStartRequirementLevel(level: number): QuestRequirementStart {
  return {
    title: 'Level',
    level,
  }
}

export function getQuestStartRequirementStamina(stamina: number): QuestRequirementStart {
  return {
    title: 'Stamina',
    stamina
  }
}
