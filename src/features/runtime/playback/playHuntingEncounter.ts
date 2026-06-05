
import type { Character } from '../../../interfaces/characters/Character.types'
import type { Mob } from '../../../interfaces/mobs/Mob.types'
import { sleep } from '../../../services/CommonServices'
import type { HuntingEncounterResult } from '../interfaces/HuntingEncounterResult'
import type { HuntingPlaybackHandlers } from '../interfaces/HuntingPlaybackHandlers'

import { renderHuntingEvent } from '../renderers/renderHuntingEvent'


interface PlayHuntingEncounterParams {
  mob: Mob

  character: Character

  result: HuntingEncounterResult

  handlers: HuntingPlaybackHandlers

  sleepMs: number
}

export async function playHuntingEncounter({
  mob,
  character,
  result,
  handlers,
  sleepMs,
}: PlayHuntingEncounterParams) {
  for (const event of result.events) {
    // ======================
    // INITIALIZE UI
    // ======================
    if (event.type === 'combat-start') {
      handlers.setMobName(event.mobName)

      handlers.setMobHp(
        mob.stats.hp.value
      )

      handlers.setMobHpMax(
        mob.stats.hp.value
      )

      handlers.setCharHp(
        character.stats.hp.value
      )
    }

    // ======================
    // UPDATE HP
    // ======================
    if (
      event.type ===
      'character-hit'
    ) {
      handlers.setMobHp(
        event.currentMobHp
      )
    }

    if (event.type === 'mob-hit') {
      handlers.setCharHp(
        event.currentCharacterHp
      )
    }

    // ======================
    // ADD LOG EVENT
    // ======================
    handlers.addEvent(
      renderHuntingEvent(event)
    )

    await sleep(sleepMs)
  }
}