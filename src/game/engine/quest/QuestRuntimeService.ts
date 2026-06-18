import { gameEventBus } from '../event-bus/GameEventBus'
import { activityRuntimeService } from '../activity/ActivityRuntimeService'
import { gameClockService } from '../clock/GameClockService'
import { GAME_QUESTS } from '../../entities/quest/data/quest/Quests.data'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { notificationService } from '../notifications/NotificationService'

class QuestRuntimeService {

  init() {
    gameEventBus.subscribe(event => {

      // =========================
      // QUEST START
      // =========================
      if (event.type === 'quest:start') {
        this.startQuest(event.characterId, event.questId, event.continuous ?? false)
      }

      // =========================
      // QUEST COMPLETE (FROM ACTIVITY SYSTEM)
      // =========================
      if (event.type === 'activity:complete' && event.activityType === 'questing') {
        const questId = event.meta?.questId
        if (!questId) return

        this.completeQuest(event.characterId, questId, event.continuous ?? false)
      }

      // =========================
      // QUEST CANCEL
      // =========================
      if (event.type === 'activity:cancel' && event.activityType === 'questing') {
        const questId = event.meta?.questId
        if (!questId) return

        gameEventBus.emit({
          type: 'quest:cancel',
          characterId: event.characterId,
          questId
        })
      }
    })
  }

  // =========================
  // QUEST START LOGIC
  // =========================
  private startQuest(characterId: string, questId: string, continuous: boolean) {

    const quest = GAME_QUESTS.find(q => q.id === questId)
    if (!quest) return

    const character = characterRuntimeService.getCharacter(characterId)
    if (!character) return

    // -----------------------------------
    // 1. APPLY START REQUIREMENTS
    // -----------------------------------
    const staminaCost = quest.requirements.start?.find(r => r.stamina)?.stamina ?? 0
    if(character.stamina < staminaCost){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} doesn't have enough stamina to start this quest.`,
        type: 'info'
      })
      gameEventBus.emit({
        type: 'quest:cancel',
        characterId,
        questId
      })
      return
    }
    character.stamina = Math.max(0, character.stamina - staminaCost)

    // mark dirty via runtime
    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    // optional immediate save (recommended for safety)
    gameEventBus.emit({
      type: 'character:save',
      characterId
    })

    // -----------------------------------
    // 2. START ACTIVITY
    // -----------------------------------
    const durationReq = quest.requirements.complete.find(r => r.timeMillis)
    if(!continuous){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} started the quest "${quest.titleString}"`,
        type: 'info'
      })
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} used ${staminaCost} stamina.`,
        type: 'warning'
      })
    }
    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      type: 'questing',
      duration: durationReq?.timeMillis ?? 0,
      startedAt: gameClockService.getNow(),
      status: 'active',
      blocking: true,
      continuous,
      meta: {
        questId: quest.id,
        questName: quest.titleString
      }
    })
  }

  // =========================
  // QUEST COMPLETE LOGIC
  // =========================
  private completeQuest(characterId: string, questId: string, continuous: boolean) {

    const quest = GAME_QUESTS.find(q => q.id === questId)
    if (!quest) return

    const character = characterRuntimeService.getCharacter(characterId)
    if (!character) return

    // -----------------------------------
    // 1. APPLY REWARDS
    // -----------------------------------
    let totalXp = 0

    for (const reward of quest.rewards) {
      if (reward.xp) {
        totalXp += reward.xp
      }
    }

    character.xp += totalXp

    // player XP (if needed)
    // const player = (character as any).playerRef // optional future improvement

    // -----------------------------------
    // 2. LEVEL UP CHECK (basic placeholder)
    // -----------------------------------
    if (character.xp >= character.xpNextLevel) {
      character.level += 1
      character.xp -= character.xpNextLevel
      character.xpNextLevel = Math.floor(character.xpNextLevel * 1.2)
    }
    
    notificationService.notify({
      lifetime: 5000,
      text: `${character.name} completed the quest "${quest.titleString}"`,
      type: 'success'
    })
    notificationService.notify({
      lifetime: 5000,
      text: `${character.name} gained ${totalXp} XP.`,
      type: 'success'
    })
    // -----------------------------------
    // 3. MARK DIRTY + SAVE
    // -----------------------------------
    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    gameEventBus.emit({
      type: 'character:save',
      characterId
    })

    // -----------------------------------
    // 4. NOTIFY SYSTEM
    // -----------------------------------
    gameEventBus.emit({
      type: 'quest:complete',
      characterId,
      questId,
      continuous
    })

    // -----------------------------------
    // 5. CONTINUOUS QUEST LOOP
    // -----------------------------------
    if (continuous) {
      setTimeout(() => {
        gameEventBus.emit({
          type: 'quest:start',
          characterId,
          questId,
          continuous
        })
      }, 1500)
    }
  }
}

export const questRuntimeService = new QuestRuntimeService()