import type { RuntimeActivityProcessor } from '../interfaces/RuntimeActivityProcessor'
import type { RuntimeActivity } from '../interfaces/RuntimeActivity'
import type { RuntimeTickResult } from '../interfaces/RuntimeTickResult'
import type { HuntingActivityState } from '../interfaces/HuntingActivityState'
import type { RuntimeMutation } from '../interfaces/RuntimeMutation'

export class HuntingActivityProcessor
  implements RuntimeActivityProcessor
{
  processTick(
    activity: RuntimeActivity,
    now: number
  ): RuntimeTickResult {
    const state =
      activity.state as HuntingActivityState

    const mutations: RuntimeMutation[] = []
    const events: string[] = []

    if (state.turn === 'character') {
      const damage = 10

      state.currentMobHp = Math.max(
        0,
        state.currentMobHp - damage
      )

      events.push(`Character hit for ${damage}`)

      if (state.currentMobHp <= 0) {
        return {
          completed: true,
          mutations,
          events,
        }
      }

      state.turn = 'mob'
    } else {
      const damage = 5

      state.currentCharacterHp = Math.max(
        0,
        state.currentCharacterHp - damage
      )

      mutations.push({
        type: 'character-hp',
        characterId: state.characterId,
        value: state.currentCharacterHp,
      })

      events.push(`Mob hit for ${damage}`)

      if (state.currentCharacterHp <= 0) {
        return {
          completed: true,
          mutations,
          events,
        }
      }

      state.turn = 'character'
    }

    return {
      completed: false,
      nextTickAt: now + 1500,
      mutations,
      events,
    }
  }
}