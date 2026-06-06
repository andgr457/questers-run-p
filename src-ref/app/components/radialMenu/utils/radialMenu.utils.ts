import { travelTo } from '../../../../game/actions/travelAction'
import { WORLD_GRAPH } from '../../../../game/world/worldGraph'
import type { WorldLocation } from '../../../../game/world/worldState'
import type { RadialItem } from '../RadialMenu.types'

const MAX_DEPTH = 3

export function buildWorldRadialItems(
  from: WorldLocation,
  characterId: string,
  depth = 1,
): RadialItem[] {
  if (depth > MAX_DEPTH) return []
  if(!from || !characterId) return []

  const connections = WORLD_GRAPH[from]

  if (!connections || connections.length === 0) {
    return []
  }

  return connections.map(c => {
    return {
      id: `${from}_${c.to}_${depth}`,
      label: c.to.toUpperCase(),

      onClick: () => {
        travelTo({
          characterId,
          from,
          to: c.to
        })
      },

      children: buildWorldRadialItems(
        c.to,
        characterId,
        depth + 1,
      ),
    }
  })
}