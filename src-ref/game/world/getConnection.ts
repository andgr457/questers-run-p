import type { WorldLocation } from './worldState'
import { WORLD_GRAPH } from './worldGraph'

export function getConnection(
  from: WorldLocation,
  to: WorldLocation
) {
  return WORLD_GRAPH[from]?.find(c => c.to === to)
}