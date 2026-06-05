import type { WorldLocation } from './worldState'

export type WorldConnection = {
  to: WorldLocation
  travelMs: number
}

export const WORLD_GRAPH: Record<
  WorldLocation,
  WorldConnection[]
> = {
  plains: [
    { to: 'town', travelMs: 1000 },
    { to: 'woods', travelMs: 1000 },
  ],

  town: [
    { to: 'plains', travelMs: 1000 },
    { to: 'guild', travelMs: 750 },
  ],

  guild: [
    { to: 'town', travelMs: 750 },
  ],

  woods: [
    { to: 'plains', travelMs: 1000 },
    { to: 'cave', travelMs: 1000 },
  ],

  cave: [
    { to: 'woods', travelMs: 1000 },
    { to: 'dungeon', travelMs: 1000 },
  ],

  dungeon: [
    { to: 'cave', travelMs: 1000 },
  ],
}