import { useEffect, useState } from 'react'
import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types'
import { eventBus } from '../../event/EventBus'
import { questRuntimeService } from '../QuestRuntimeService'
import { GAME_EVENT_BUS_QUEST_TYPES } from '../data/QuestEvents.data'

export function useQuests() {
  const [characterQuests, setCharacterQuests] = useState<
    Record<string, QuestEntity | undefined>
  >(questRuntimeService.getCharacterQuests())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (!GAME_EVENT_BUS_QUEST_TYPES.includes(event.type)) {
        return
      }

      setCharacterQuests(questRuntimeService.getCharacterQuests())
    })

    return unsub
  }, [])

  return {
    characterQuests
  }
}