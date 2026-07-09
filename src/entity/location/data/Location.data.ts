import type { Location } from '../types/Location.types'

export const LOCATION_IDS = {
  //Each char starts in the unnamed woods
  ORON_WOODS_1: 'oron_woods',
  ORON_TOWN: 'oron_town',
  ORON_ADV_GUILD: 'oron_adv_guild',
  ORON_PLAINS: 'oron_plains',
  ORON_MINE: 'oron_mine',
} as const

const DISTANCES = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 10000,
  VERY_LONG: 20000,
  IN_TOWN: 500
}

export const GAME_LOCATIONS: Location[] = [
  {
    id: LOCATION_IDS.ORON_WOODS_1,
    name: 'Oron Woods',
    description: 'Small wooded area just outside of the town of Oron.',
    linkedLocationIds: [
      LOCATION_IDS.ORON_TOWN
    ],
    type: 'woods',
    mobIds: [],
    professionItemIds: [],
    level: 1,
    travelMs: DISTANCES.SHORT
  },
  {
    id: LOCATION_IDS.ORON_TOWN,
    name: 'Town of Oron',
    description: 'The bustling town of Oron where low level adventurers can grow.',
    linkedLocationIds: [
      LOCATION_IDS.ORON_WOODS_1,
      LOCATION_IDS.ORON_ADV_GUILD,
      LOCATION_IDS.ORON_PLAINS,
    ],
    type: 'town',
    mobIds: [],
    professionItemIds: [],
    level: 1,
    travelMs: DISTANCES.SHORT
  },
  {
    id: LOCATION_IDS.ORON_ADV_GUILD,
    name: 'Oron Adventurer\'s Guild',
    description: 'Oron\'s own Adventurers Guild where you first sign up to accept quests.',
    linkedLocationIds: [
      LOCATION_IDS.ORON_TOWN,
    ],
    type: 'adv_guild',
    mobIds: [],
    professionItemIds: [],
    level: 1,
    travelMs: DISTANCES.IN_TOWN
  },
  {
    id: LOCATION_IDS.ORON_PLAINS,
    name: 'Oron Plains',
    description: 'The wild open grassy plains east of Oron.',
    linkedLocationIds: [
      LOCATION_IDS.ORON_TOWN,
      LOCATION_IDS.ORON_MINE
    ],
    type: 'plains',
    mobIds: [],
    professionItemIds: [],
    level: 1,
    travelMs: DISTANCES.MEDIUM
  },
  {
    id: LOCATION_IDS.ORON_MINE,
    name: 'Oron Mine',
    description: 'A dark, damp, mine located north of Oron Plains.',
    linkedLocationIds: [
      LOCATION_IDS.ORON_PLAINS,
    ],
    type: 'mine',
    mobIds: [],
    professionItemIds: [],
    level: 2,
    travelMs: DISTANCES.MEDIUM
  },
]