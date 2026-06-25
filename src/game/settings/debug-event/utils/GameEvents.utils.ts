import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService'
import type { GameEvent } from '../../../../engine/event/types/EventBus.types'
import { GAME_DEBUG_EVENT_DEFAULTS } from '../data/DebugEvents.data'

export const getDebugGamePlayerSaveEmit = () => {
  const clone: GameEvent | undefined = structuredClone(GAME_DEBUG_EVENT_DEFAULTS['player:save'])
  if(!clone){
    return
  }

  clone.id = crypto.randomUUID()
  if(clone.meta?.player){
    clone.meta.player.id = crypto.randomUUID()
    clone.meta.player.name = 'debug-player'
  }
  return clone
}

export const getDebugGamePlayerGoldEmit = (amount: number) => {
  const clone: GameEvent | undefined = structuredClone(GAME_DEBUG_EVENT_DEFAULTS['player:gold'])
  if(!clone) return

  clone.id = crypto.randomUUID()
  if(clone.meta?.playerGoldTransaction){
    clone.meta.playerGoldTransaction.id = crypto.randomUUID()
    clone.meta.playerGoldTransaction.date = clockRuntimeService.getNow()
    clone.meta.playerGoldTransaction.amount = amount
  }
  return clone
}

export const getDebugGamePlayerXPEmit = (amount: number) => {
  const clone: GameEvent | undefined = structuredClone(GAME_DEBUG_EVENT_DEFAULTS['player:xp'])
  if(!clone) return

  clone.id = crypto.randomUUID()
  if(clone.meta){
    clone.meta.xp = amount
  }
  return clone
}

interface DetailValue {
  field: string
  value: unknown
}
export function flattenMeta(
  value: unknown,
  path = '',
  results: DetailValue[] = []
): DetailValue[] {
  if (
    value === null ||
    value === undefined ||
    typeof value !== 'object'
  ) {
    results.push({
      field: path,
      value,
    })

    return results
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenMeta(item, `${path}[${index}]`, results)
    })

    return results
  }

  Object.entries(value).forEach(([key, val]) => {
    const nextPath = path ? `${path}.${key}` : key
    flattenMeta(val, nextPath, results)
  })

  return results
}