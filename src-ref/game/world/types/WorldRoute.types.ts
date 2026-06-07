import type { WorldLocation } from './WorldLocation.types'

export type RouteStep = {
  from: WorldLocation
  to: WorldLocation
  travelMs: number
}

export type RouteResult = {
  steps: RouteStep[]
  totalMs: number
}
