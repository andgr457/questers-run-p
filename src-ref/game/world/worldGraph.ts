import type { WorldLocation } from './worldState'

export type WorldConnection = {
  to: WorldLocation
  travelMs: number
}

export type WorldGraphRecord = Record<
  WorldLocation,
  WorldConnection[]
>

export const WORLD_GRAPH: WorldGraphRecord = {
  plains: [
    { to: 'town', travelMs: 2000 },
    { to: 'woods', travelMs: 1500 },
  ],

  town: [
    { to: 'plains', travelMs: 2000 },
    { to: 'guild', travelMs: 1000 },
  ],

  guild: [
    { to: 'town', travelMs: 1000 },
  ],

  woods: [
    { to: 'plains', travelMs: 1500 },
    { to: 'cave', travelMs: 1000 },
  ],

  cave: [
    { to: 'woods', travelMs: 1000 },
    { to: 'dungeon', travelMs: 3000 },
  ],

  dungeon: [
    { to: 'cave', travelMs: 3000 },
  ],
}