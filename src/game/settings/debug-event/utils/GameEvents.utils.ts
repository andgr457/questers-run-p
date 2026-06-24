import type { GameEventType } from '../../../../engine/event/types/EventBus.types'
import { GAME_DEBUG_EVENT_DEFAULTS } from '../data/DebugEvents.data'

export const getDebugGameEventEmit = (type: GameEventType) => {
  return structuredClone(GAME_DEBUG_EVENT_DEFAULTS[type])
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