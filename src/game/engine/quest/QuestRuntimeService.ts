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
        this.startQuest(event.characterId, event.meta?.questId as string, event.continuous ?? false)
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
    const hpCost = quest.requirements.start?.find(req => req.hp)?.hp ?? 0
    if(character.hp < hpCost){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} doesn't have enough health to start this quest.`,
        type: 'error'
      })
      gameEventBus.emit({
        type: 'quest:cancel',
        characterId,
      })
      return
    }
    if(character.stamina < staminaCost){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} doesn't have enough stamina to start this quest.`,
        type: 'error'
      })
      gameEventBus.emit({
        type: 'quest:cancel',
        characterId,
      })
      return
    }
    character.stamina = Math.max(0, character.stamina - staminaCost)
    character.hp = Math.max(0, character.hp - hpCost)

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
    }
    if(staminaCost > 0){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} used ${staminaCost} stamina.`,
        type: 'warning'
      })
    }
    if(hpCost > 0){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} took ${hpCost} HP damage.`,
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

    if(!continuous){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} completed the quest "${quest.titleString}"`,
        type: 'success'
      })
    }
    // -----------------------------------
    // 1. APPLY REWARDS
    // -----------------------------------
    let totalXp = 0
    let totalGold = 0

    for (const reward of quest.rewards) {
      if (reward.xp) {
        totalXp += reward.xp
      }
      if(reward.gold){
        totalGold += reward.gold
      }
    }

    character.xp += totalXp
    character.gold += totalGold

    notificationService.notify({
      lifetime: 5000,
      text: `${character.name} gained ${totalXp} XP and ${totalGold} gold!`,
      type: 'success'
    })

    // player XP (if needed)
    // const player = (character as any).playerRef // optional future improvement

    // -----------------------------------
    // 2. LEVEL UP CHECK (basic placeholder)
    // -----------------------------------
    if (character.xp >= character.xpNextLevel) {
      character.level += 1
      character.xp -= character.xpNextLevel
      character.xpNextLevel = Math.floor(character.xpNextLevel * 1.2)
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} leveled up to Lv. ${character.level}!`,
        type: 'success'
      })
    }
    
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
      continuous,
      meta: {
        questId
      }
    })

    // -----------------------------------
    // 5. CONTINUOUS QUEST LOOP
    // -----------------------------------
    if (continuous) {
      setTimeout(() => {
        gameEventBus.emit({
          type: 'quest:start',
          characterId,
          continuous,
          meta: {
            questId
          }
        })
      }, 1500)
    }
  }
}

export const questRuntimeService = new QuestRuntimeService()