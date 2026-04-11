import { ACHIEVEMENT_INTRO_MAIN_CHARACTER, ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data';
import type { Achievement } from '../../interfaces/achievements/Achievement.types';

export class AchievementRepository {
  async list(): Promise<Achievement[]> {
    return [
      ACHIEVEMENT_INTRO_MAIN_CHARACTER,
      ACHIEVEMENT_INTRO_ADVENTURERS_GUILD
    ]
  }
}