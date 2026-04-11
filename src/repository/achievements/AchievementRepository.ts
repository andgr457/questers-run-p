import { ACHIEVEMENT_INTRO_MAIN_CHARACTER, ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data';
import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export class AchievementRepository {
  private ALL_ACHIEVEMENTS: Achievement[] = [
    ACHIEVEMENT_INTRO_MAIN_CHARACTER,
    ACHIEVEMENT_INTRO_ADVENTURERS_GUILD
  ]

  async list(): Promise<Achievement[]> {
    return this.ALL_ACHIEVEMENTS
  }

  async byId(id: string): Promise<Achievement | undefined> {
    return this.ALL_ACHIEVEMENTS.find(a => a.id === id)
  }
}