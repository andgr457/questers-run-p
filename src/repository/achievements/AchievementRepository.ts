import { ACHIEVEMENT_HUNTING_ALL } from '../../data/achievements/Achievements.Hunting.data';
import { ACHIEVEMENT_INTRO_ALL } from '../../data/achievements/Achievements.Intro.data';
import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export class AchievementRepository {
  private ALL_ACHIEVEMENTS: Achievement[] = [
    ...ACHIEVEMENT_INTRO_ALL,
    ...ACHIEVEMENT_HUNTING_ALL,
  ]

  async list(): Promise<Achievement[]> {
    return this.ALL_ACHIEVEMENTS
  }

  async byId(id: string): Promise<Achievement | undefined> {
    return this.ALL_ACHIEVEMENTS.find(a => a.id === id)
  }
}