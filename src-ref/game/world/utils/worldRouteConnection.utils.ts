import type { RadialItem } from '../../../app/components/radialMenu/RadialMenu.types';
import { travelTo } from '../worldActions';
import { WORLD_GRAPH, type WorldConnection } from '../worldGraph';
import type { WorldLocation } from '../worldState';

export const getWorldRouteConnectionsByFromLocation = (
  from: WorldLocation,
): WorldConnection[] | undefined => {
  if(!from) return undefined
  return WORLD_GRAPH[from]
}

export const getRadialItemsForConnections = (
  connections: WorldConnection[],
  characterId: string,
  onMouseEnter: () => void
): RadialItem[] | undefined => {
  if(!connections || connections.length === 0) return undefined

  return connections.map(c => {
    return {
      id: `${c.to}_connection`,
      label: c.to.toUpperCase(),
      onClick: () => {
        travelTo(
          characterId,
          c.to
        )
      },
      onMouseEnter,
    }
  })
}