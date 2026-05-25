import type { CharacterAchievements } from '../interfaces/characters/Character.types';

export function achievementServiceCharacterHasAchievement(
  characterAchievements: CharacterAchievements[],
  id: string
) {
  const result = !!characterAchievements?.some(a => a.achievementId === id)
  return result
}
