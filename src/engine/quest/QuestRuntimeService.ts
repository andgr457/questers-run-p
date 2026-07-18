import { GAME_QUESTS } from '../../entity/quest/data/Quest.data'
import type { QuestEntity } from '../../entity/quest/types/QuestEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import type { QuestHistory } from './types/QuestHistory.types'

class QuestRuntimeService {
  private initialized = false
  private saveInterval: number | undefined

  private characterQuestsIds: Record<string, string> = {}
  private characterQuests: Record<string, QuestEntity | undefined> = {}

  private historyCharacterQuests: Record<string, QuestHistory[]> = {}

  private dirtyCharacterQuests = new Set<string>()
  private dirtyCharacterQuestHistory = new Set<string>()

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    const characterQuestsValue = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTERS_QUEST_GAME
    )

    if (characterQuestsValue) {
      this.characterQuestsIds = JSON.parse(characterQuestsValue)
    }

    const historyCharacterQuestsValue = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTERS_QUEST_HISTORY_GAME
    )

    if (historyCharacterQuestsValue) {
      this.historyCharacterQuests = JSON.parse(historyCharacterQuestsValue)
    }

    this.updateQuestEntities()

    eventBus.subscribe(event => {
      if (event.type === 'quest:start') {
        this.startQuest(event)
      }

      if (event.type === 'quest:complete') {
        this.completeQuest(event)
      }
    })
  }

  start() {
    if (this.saveInterval) {
      return
    }

    this.saveInterval = window.setInterval(() => {
      this.flushDirtyCharacterQuests()
    }, 5000)
  }

  stop() {
    if (!this.saveInterval) {
      return
    }

    clearInterval(this.saveInterval)

    this.saveInterval = undefined
  }

  getCharacterQuests() {
    return this.characterQuests
  }

  getCharacterQuest(characterId: string): QuestEntity | undefined {
    return this.characterQuests[characterId]
  }

  getCharacterAllHistory(): Record<string, QuestHistory[]> {
    return this.historyCharacterQuests
  }

  getCharacterQuestHistory(characterId: string): QuestHistory[] {
    return this.historyCharacterQuests[characterId] ?? []
  }

  private getCharacterQuestId(characterId: string): string | undefined {
    return this.characterQuestsIds[characterId]
  }

  private startQuest(event: GameEvent) {
    const characterId = event.meta?.characterId as string
    const questId = event.meta?.questId as string

    if (!characterId || !questId) {
      return
    }

    const quest = GAME_QUESTS.find(
      q => q.id === questId
    )

    if (!quest) {
      return
    }

    this.characterQuestsIds[characterId] = questId
    this.characterQuests[characterId] = quest

    this.dirtyCharacterQuests.add(characterId)

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'quest:started',
      meta: {
        characterId,
        quest
      }
    })
  }

  private completeQuest(event: GameEvent) {
    const characterId = event.meta?.characterId as string

    if (!characterId) {
      return
    }

    const quest = this.characterQuests[characterId]

    if (!quest) {
      return
    }

    this.addQuestHistory(
      characterId,
      quest.id
    )

    delete this.characterQuestsIds[characterId]
    delete this.characterQuests[characterId]

    this.dirtyCharacterQuests.add(characterId)
    this.dirtyCharacterQuestHistory.add(characterId)

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'quest:completed',
      meta: {
        characterId,
        quest
      }
    })
  }

  private addQuestHistory(
    characterId: string,
    questId: string
  ) {
    const history = this.historyCharacterQuests[characterId] ?? []

    const existing = history.find(
      h => h.questId === questId
    )

    if (existing) {
      existing.dates.push(Date.now())
      existing.completedAmount++
    } else {
      history.push({
        characterId,
        questId,
        dates: [
          Date.now()
        ],
        completedAmount: 1
      })
    }

    this.historyCharacterQuests[characterId] = history
  }

  private updateQuestEntities() {
    this.characterQuests = {}

    for (const characterId of Object.keys(this.characterQuestsIds)) {
      this.updateCharacterQuestEntity(characterId)
    }
  }

  private updateCharacterQuestEntity(characterId: string) {
    const questId = this.getCharacterQuestId(characterId)

    if (!questId) {
      delete this.characterQuests[characterId]
      return
    }

    this.characterQuests[characterId] = GAME_QUESTS.find(
      q => q.id === questId
    )
  }

  private flushDirtyCharacterQuests() {
    if (
      this.dirtyCharacterQuests.size === 0 &&
      this.dirtyCharacterQuestHistory.size === 0
    ) {
      return
    }

    if (this.dirtyCharacterQuests.size > 0) {
      localStorage.setItem(
        GAME_STORAGE_KEYS.CHARACTERS_QUEST_GAME,
        JSON.stringify(this.characterQuestsIds)
      )

      this.dirtyCharacterQuests.clear()
    }

    if (this.dirtyCharacterQuestHistory.size > 0) {
      localStorage.setItem(
        GAME_STORAGE_KEYS.CHARACTERS_QUEST_HISTORY_GAME,
        JSON.stringify(this.historyCharacterQuests)
      )

      this.dirtyCharacterQuestHistory.clear()
    }
  }
}

export const questRuntimeService =
  new QuestRuntimeService()