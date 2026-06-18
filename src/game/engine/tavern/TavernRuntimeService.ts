import { gameEventBus } from '../event-bus/GameEventBus'
import { activityRuntimeService } from '../activity/ActivityRuntimeService'
import { gameClockService } from '../clock/GameClockService'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { notificationService } from '../notifications/NotificationService'
import { GAME_TAVERN_ACTIONS } from '../../entities/tavern/data/Tavern.data'

class TavernRuntimeService {

  init() {
    gameEventBus.subscribe(event => {

      // =========================
      // START
      // =========================
      if (event.type === 'tavern:start') {
        this.start(event.characterId, event.meta?.tavernActionId as string)
      }

      // =========================
      // COMPLETE (FROM ACTIVITY SYSTEM)
      // =========================
      if (event.type === 'activity:complete' && event.activityType === 'resting') {
        this.complete(event.characterId, event.meta?.tavernActionId as string)
      }

      // =========================
      // QUEST CANCEL
      // =========================
      if (event.type === 'activity:cancel' && event.activityType === 'resting') {
        gameEventBus.emit({
          type: 'tavern:cancel',
          characterId: event.characterId,
          meta: {
            tavernActionId: event.meta?.tavernActionId
          }
        })
      }
    })
  }

  // =========================
  // QUEST START LOGIC
  // =========================
  private start(characterId: string, actionId: string) {

    const tavernAction = GAME_TAVERN_ACTIONS.find(q => q.id === actionId)
    if (!tavernAction) return

    const character = characterRuntimeService.getCharacter(characterId)
    if (!character) return

    // -----------------------------------
    // 1. APPLY START REQUIREMENTS
    // -----------------------------------
    const allStatsFilled = character.hp >= character.hpMax
      && character.mana >= character.staminaMax
      && character.stamina >= character.staminaMax
    
    if(allStatsFilled){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} is already fully rested.`,
        type: 'info'
      })
      gameEventBus.emit({
        type: 'tavern:cancel',
        characterId,
      })
      return
    }

    const hasEnoughGold = character.gold >= tavernAction.cost
    if(!hasEnoughGold){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} does not have enough gold.`,
        type: 'info'
      })
      gameEventBus.emit({
        type: 'tavern:cancel',
        characterId,
      })
      return
    }
    character.gold = character.gold - tavernAction.cost

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
    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      type: 'resting',
      duration: tavernAction.duration,
      startedAt: gameClockService.getNow(),
      status: 'active',
      blocking: true,
      continuous: false,
      meta: {
        tavernActionId: tavernAction.id
      }
    })
  }

  // =========================
  // QUEST COMPLETE LOGIC
  // =========================
  private complete(characterId: string, actionId: string) {

    const tavernAction = GAME_TAVERN_ACTIONS.find(t => t.id === actionId)
    if (!tavernAction) return

    const character = characterRuntimeService.getCharacter(characterId)
    if (!character) return

    // -----------------------------------
    // 1. APPLY REWARDS
    // -----------------------------------
    const hpAmount = character.hpMax * tavernAction.percent
    const manaAmount = character.manaMax * tavernAction.percent
    const staminaAmount = character.staminaMax * tavernAction.percent

    character.hp = Math.min(character.hp + hpAmount, character.hpMax)
    character.mana = Math.min(character.mana + manaAmount, character.manaMax)
    character.stamina = Math.min(character.stamina + staminaAmount, character.staminaMax)

    // player XP (if needed)
    // const player = (character as any).playerRef // optional future improvement

    notificationService.notify({
      lifetime: 5000,
      text: `${character.name} rested for ${tavernAction.percent * 100}% stat gains.`,
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
      type: 'tavern:complete',
      characterId,
      meta: {
        tavernActionId: actionId
      }
    })
  }
}

export const tavernRuntimeService = new TavernRuntimeService()