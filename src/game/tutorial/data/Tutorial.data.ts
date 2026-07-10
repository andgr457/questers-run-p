import type { Tutorial } from '../types/Tutorial.types'
import { getBaseTutorialRewards } from '../utils/Tutorial.utils'

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

export const BASE_TUTORIAL_REWARDS = {
  xp: 5,
  gold: 5,
}

export const GAME_TUTORIALS: Tutorial[] = [
  {
    id: TUTORIAL_IDS.TRAVEL_TO_TOWN,
    title: 'Travel to Town',
    description:
      'The road ahead leads toward the nearby town of Oron. Travel there using Character actions.',
    hints: [
      {
        title: 'Characters List',
        description: 'Click the "c" circle on the left to access your character list.',
        uiPath: 'characters'
      },
      {
        title: 'Manage Character',
        description: 'Click the cog wheel "⚙" on the right of the character you wish to manage.',
        uiPath: 'characters:manage'
      },
      {
        title: 'Travel Actions',
        description: 'Click "Travel" on the "Town of Oron" travel action.',
        uiPath: 'characters:manage:travel:town'
      },
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.VISIT_ADV_GUILD,
    title: "Adventurer's Guild",
    description:
      "Visit the local Adventurer's Guild in town to take a quest.",
    hints: [
      {
        title: 'Current Location',
        description: 'While at the "Town of Oron"...',
      },
      {
        title: 'Characters List',
        description: 'Click the "c" circle on the left to access your character list. Alternatively, "cm" brings you directly to the last managed character.',
        uiPath: 'characters'
      },
      {
        title: 'Manage Character',
        description: 'Click the cog wheel "⚙" on the right of the character you wish to manage.',
        uiPath: 'characters:manage'
      },
      {
        title: 'Travel Actions',
        description: "Click \"Travel\" on the \"Oron Adventurer's Guild\" travel action.",
        uiPath: 'characters:manage:travel:adv_guild'
      },
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.ACCEPT_FIRST_QUEST,
    title: 'Quest Accepted',
    description:
      "Take your first quest at the Adventurer's Guild.",
    hints: [
      {
        title: 'Current Location',
        description: 'While at the "Oron Adventurer\'s Guild"...',
      },
      {
        title: 'Manage Character',
        description: 'Click the cog wheel "⚙" on the right of the character you wish to manage.',
        uiPath: 'characters:manage'
      },
      {
        title: 'Enter the Guild',
        description: 'Click the action to "Enter the Oron Adventuer\'s Guild" to bring up the guild window.',
        uiPath: 'characters:manage:action:adv_guild',
      }
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.COMPLETE_FIRST_QUEST,
    title: 'Quest Complete',
    description:
      "Turn in your first quest at the Adventurer's Guild.",
    hints: [],
    rewards: [
      {
        ...getBaseTutorialRewards('player'),
        characterTokens: 1
      },
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.CREATE_SECOND_CHARACTER,
    title: 'Battle Buddy',
    description:
      'Create a second character with your new character token.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.CREATE_FIRST_PARTY,
    title: 'Party Hardy',
    description: 'Create a party with a character.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.JOIN_PARTY,
    title: 'Party on Garth',
    description:
      "Have another character join an existing character's party.",
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.PARTY_ROLES,
    title: 'Party Hardy',
    description:
      'Assign a party role to a party member.',
    hints: [],
    rewards: [
      {
        ...getBaseTutorialRewards('player'),
        characterTokens: 3
      },
      getBaseTutorialRewards('character'),
    ],
  },

  {
    id: TUTORIAL_IDS.FULL_PARTY,
    title: 'No Occupancy',
    description:
      'Create 3 more characters and have them join your party. A tank, healer, and 3 damage dealers are required for dungeons and raids.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
  },
]