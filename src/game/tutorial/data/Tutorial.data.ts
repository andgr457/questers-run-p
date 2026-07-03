import type { Tutorial } from '../types/Tutorial.types'

export const TUTORIAL_IDS = {
  TRAVEL_TO_TOWN: 'travel_to_town',
  VISIT_ADV_GUILD: 'visit_adv_guild',
  ACCEPT_FIRST_QUEST: 'accept_first_quest',
  COMPLETE_FIRST_QUEST: 'complete_first_quest',
  CREATE_SECOND_CHARACTER: 'create_second_character',
  CREATE_FIRST_PARTY: 'create_first_party',
  JOIN_PARTY: 'join_party',
  PARTY_ROLES: 'party_roles',
  FULL_PARTY: 'full_party',
} as const

const BASE_TUTORIAL_REWARDS = {
  xp: 5,
  gold: 5,
}

export const TUTORIALS: Tutorial[] = [
  {
    id: TUTORIAL_IDS.TRAVEL_TO_TOWN,
    title: 'Travel',
    description: 'The road ahead leads toward a nearby town. Tap the "c" to the left to see all your characters, then tap on a character, select Travel, and then choose Town.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
      characterSpecific: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.VISIT_ADV_GUILD,
    title: 'Adventurer\'s Guild',
    description: 'Visit the local Adventurer\'s Guild in town to take a quest.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.ACCEPT_FIRST_QUEST,
    title: 'Quest Accepted',
    description: 'Take your first quest at the Adventurer\'s Guild.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.COMPLETE_FIRST_QUEST,
    title: 'Quest Complete',
    description: 'Turn in your first quest at the Adventurer\'s Guild.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS,
        characterTokens: 1,
      },
    }
  },
  {
    id: TUTORIAL_IDS.CREATE_SECOND_CHARACTER,
    title: 'Battle Buddy',
    description: 'Create a second character with your new character token.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.CREATE_FIRST_PARTY,
    title: 'Party Hardy',
    description: 'Create a party with a character.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.JOIN_PARTY,
    title: 'Party on Garth',
    description: 'Have another character join an existing character\'s party.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
  {
    id: TUTORIAL_IDS.PARTY_ROLES,
    title: 'Party Hardy',
    description: 'Assign a party role to a party member.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS,
        characterTokens: 3,
      },
    }
  },
  {
    id: TUTORIAL_IDS.FULL_PARTY,
    title: 'No Occupancy',
    description: 'Create 3 more characters and have them join your party. A tank, healer, and 3 damage dealers are required for dungeons and raids.',
    rewards: {
      player: {
        ...BASE_TUTORIAL_REWARDS
      },
      charactersAll: {
        ...BASE_TUTORIAL_REWARDS
      },
    }
  },
]