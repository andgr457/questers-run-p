import { DateTime } from 'luxon'
import { ACHIEVEMENT_GATHERING_IDS } from '../../../data/achievements/Achievements.Gathering.data'
import { ACHIEVEMENT_HUNTING_IDS } from '../../../data/achievements/Achievements.Hunting.data'
import { QUEST_PROFESSION_IDS } from '../../../data/quests/Quests.Gathering.data'
import { QUEST_HUNTING_IDS } from '../../../data/quests/Quests.Hunting.data'
import type { Character, CharacterAchievements } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestProgress } from '../../../interfaces/quests/Quests.types'

export function resolveQuestStart(params: {
  quest: Quest
  character: Character | null
  now: number
}) {
  const { quest, character, now } = params
  if(!character) return
   
  const characterId = character.id
  const startTime = DateTime.fromMillis(now).toISO()

  // -------------------------
  // 1. QUEST PROGRESS RECORD
  // -------------------------
  const questProgress: QuestProgress = {
    id: `qprogress_${characterId}_${quest.id}_${now}`,
    characterId,
    questId: quest.id,
    startDate: startTime!,
    status: 'in-progress',
  }

  // -------------------------
  // 2. STAMINA CALCULATION
  // -------------------------
  let questStamina = 0

  for (const req of quest.startRequirements) {
    if (req.stats?.stamina) {
      questStamina += req.stats.stamina.value ?? 0
    }
  }

  // -------------------------
  // 3. ACHIEVEMENTS
  // -------------------------
  const newAchievements: CharacterAchievements[] = []

  if (
    quest.id === QUEST_PROFESSION_IDS.STICKS_N_STONES &&
    !character.achievements.find(
      a =>
        a.achievementId ===
        ACHIEVEMENT_GATHERING_IDS.QUEST_TAKE_STICK,
    )
  ) {
    newAchievements.push({
      achievementId: ACHIEVEMENT_GATHERING_IDS.QUEST_TAKE_STICK,
      achievementDate: startTime!,
    })
  }

  if (
    quest.id === QUEST_HUNTING_IDS.SLIMES_GREEN &&
    !character.achievements.find(
      a =>
        a.achievementId ===
        ACHIEVEMENT_HUNTING_IDS.TAKE_QUEST_SLIME_GREEN_SMALL,
    )
  ) {
    newAchievements.push({
      achievementId:
        ACHIEVEMENT_HUNTING_IDS.TAKE_QUEST_SLIME_GREEN_SMALL,
      achievementDate: startTime!,
    })
  }

  // -------------------------
  // 4. CHARACTER PATCH
  // -------------------------
  const updatedCharacter: Character = {
    ...character,
    stats: {
      ...character.stats,
      stamina: {
        ...character.stats.stamina,
        value: character.stats.stamina.value - questStamina,
      },
    },
    achievements: [
      ...character.achievements,
      ...newAchievements,
    ],
  }

  return {
    questProgress,
    updatedCharacter,
  }
}