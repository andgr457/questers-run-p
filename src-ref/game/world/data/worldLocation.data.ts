import type { WorldLocation } from '../types/WorldLocation.types'



export const WORLD_LOCATIONS_BASE: Record<string, Partial<WorldLocation>> = {
  VOID: {id: 'void', name: 'Void'},

  //guild
  GUILD_ADVENTURERS: {id: 'guild_adventurers'}
}

export const WORLD_LOCATION_ID_NAMES: Partial<WorldLocation>[] = [
  {
    id: 
  }
]

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'void',
    connections: [
      {
        to: 
      }
    ]
  }
]

export const WORLD_LOCATION_CONNECTION_GRAPH: WorldGraphRecord = {
  void : [
    {to: 'guild', travelMs: 10000}
  ],

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