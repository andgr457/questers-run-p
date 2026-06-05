import type { QuestProgress } from '../../../interfaces/quests/Quests.types'
import { questRuntimeStore } from './questRuntimeStore'

export class QuestRuntimeEngine {
  static start(progress: QuestProgress) {
    questRuntimeStore.upsert({
      ...progress,
      status: 'in-progress',
    })
  }

  static complete(progressId: string) {
    questRuntimeStore.complete(progressId)
  }

  static abandon(progressId: string) {
    questRuntimeStore.remove(progressId)
  }
}