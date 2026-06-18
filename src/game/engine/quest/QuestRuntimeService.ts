import { gameEventBus } from '../event-bus/GameEventBus'
import { activityRuntimeService } from '../activity/ActivityRuntimeService'
import { gameClockService } from '../clock/GameClockService'
import { GAME_QUESTS } from '../../entities/quest/data/quest/Quests.data'

class QuestRuntimeService {
  init() {
    gameEventBus.subscribe(event => {
      if (event.type === 'quest:start') {
        this.startQuest(event.characterId, event.questId, event.continuous)
      }

      if (event.type === 'activity:complete' && event.activityType === 'questing') {
        const questId = event.meta?.questId
        if (!questId) return

        gameEventBus.emit({
          type: 'quest:complete',
          characterId: event.characterId,
          questId,
          continuous: event.continuous ?? false
        })
        if (event.continuous === true) {
          console.log('waiting 1 sec to continuous')
          setTimeout(() => {
            gameEventBus.emit({
              type: 'quest:start',
              characterId: event.characterId,
              questId,
              continuous: event.continuous ?? false
            })
          }, 1500)
        }
      }

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

  private startQuest(characterId: string, questId: string, continuous: boolean) {
    const quest = GAME_QUESTS.find(q => q.id === questId)
    if (!quest) return

    const durationReq = quest.requirements.complete.find(r => r.timeMillis)

    // const xpReward = quest.rewards.reduce((t, r) => t + (r.xp ?? 0), 0)
    activityRuntimeService.start({
      id: crypto.randomUUID(),
      characterId,
      type: 'questing',
      duration: durationReq?.timeMillis ?? 2000,
      startedAt: gameClockService.getNow(),
      status: 'active',
      blocking: true,
      blockingAll: false,
      continuous,
      meta: {
        questId: quest.id,
        questName: typeof quest.title === 'string' ? quest.title : 'Quest',
        // xpReward,
      }
    })
  }
}

export const questRuntimeService = new QuestRuntimeService()