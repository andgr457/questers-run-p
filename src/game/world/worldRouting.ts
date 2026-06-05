import type { WorldLocation } from './worldState'
import { WORLD_GRAPH } from './worldGraph'

export type RouteStep = {
  from: WorldLocation
  to: WorldLocation
  travelMs: number
}

export type RouteResult = {
  steps: RouteStep[]
  totalMs: number
}

export function findRoute(
  start: WorldLocation,
  target: WorldLocation
): RouteResult | null {
  if (start === target) {
    return {
      steps: [],
      totalMs: 0,
    }
  }

  const visited = new Set<WorldLocation>()

  const queue: {
    location: WorldLocation
    steps: RouteStep[]
    totalMs: number
  }[] = [
    {
      location: start,
      steps: [],
      totalMs: 0,
    },
  ]

  while (queue.length > 0) {
    const current = queue.shift()!

    if (visited.has(current.location)) continue

    visited.add(current.location)

    const connections =
      WORLD_GRAPH[current.location] ?? []

    for (const connection of connections) {
      const nextSteps = [
        ...current.steps,
        {
          from: current.location,
          to: connection.to,
          travelMs: connection.travelMs,
        },
      ]

      const nextTotal =
        current.totalMs + connection.travelMs

      if (connection.to === target) {
        return {
          steps: nextSteps,
          totalMs: nextTotal,
        }
      }

      queue.push({
        location: connection.to,
        steps: nextSteps,
        totalMs: nextTotal,
      })
    }
  }

  return null
}