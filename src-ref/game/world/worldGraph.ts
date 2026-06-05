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
    { to: 'town', travelMs: 4000 },
    { to: 'woods', travelMs: 6000 },
  ],

  town: [
    { to: 'plains', travelMs: 4000 },
    { to: 'guild', travelMs: 2000 },
  ],

  guild: [
    { to: 'town', travelMs: 2000 },
  ],

  woods: [
    { to: 'plains', travelMs: 6000 },
    { to: 'cave', travelMs: 5000 },
  ],

  cave: [
    { to: 'woods', travelMs: 5000 },
    { to: 'dungeon', travelMs: 7000 },
  ],

  dungeon: [
    { to: 'cave', travelMs: 7000 },
  ],
}