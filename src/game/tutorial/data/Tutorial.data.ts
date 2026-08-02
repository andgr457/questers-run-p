import { ContextMenuIcon } from '../../context-menu/data/ContextMenuIcon.data'
import type { Tutorial } from '../types/Tutorial.types'
import { getBaseTutorialRewards } from '../utils/Tutorial.utils'

export const LEGACY_TUTORIAL_IDS = {
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

export const GAME_TUTORIAL_IDS = {
  TUTORIAL_001_CHARACTER_FIRST_CREATE: 't_001_character_first_create',
  TUTORIAL_002_CHARACTER_FIRST_QUEST: 't_002_character_first_quest',
  TUTORIAL_003_CHARACTER_FIRST_UPGRADE: 't_003_character_first_upgrade',
  TUTORIAL_004_PLAYER_FIRST_UPGRADE: 't_004_player_first_upgrade',
}

export const BASE_TUTORIAL_REWARDS = {
  xp: 5,
  gold: 5,
}

export const GAME_TUTORIALS: Tutorial[] = [
  {
    id: GAME_TUTORIAL_IDS.TUTORIAL_001_CHARACTER_FIRST_CREATE,
    title: 'Summon a Hero',
    description: 'Use the Summon New Hero section below to summon your first hero. A tank is required first, then a healer, then three damage heroes then it repeats from tank.',
    requirement: 'At least 1 hero summoned and tutorial collected to unlock the Quest button.',
    hints: [],
    rewards: [
      {
        type: 'player',
        xp: 10,
      }
    ]
  },
  {
    id: GAME_TUTORIAL_IDS.TUTORIAL_002_CHARACTER_FIRST_QUEST,
    title: 'Run Hero Quests',
    description: 'Click the Quest button on the hero item to start gaining gold and XP.',
    requirement: 'At least 1 character questing and tutorial collected to unlock the Upgrade button.',
    hints: [],
    rewards: [
      {
        type: 'player',
        xp: 10,
      }
    ]
  },
  {
    id: GAME_TUTORIAL_IDS.TUTORIAL_003_CHARACTER_FIRST_UPGRADE,
    title: 'Upgrade a Hero',
    description: 'Click the Upgrade button on the hero item to display hero upgrades.',
    requirement: 'At least 1 character upgrade purchased and tutorial collected to unlock.',
    hints: [],
    rewards: [
      {
        type: 'player',
        gold: 10,
        xp: 10,
      }
    ]
  }
]

export const LEGACY_GAME_TUTORIALS: Tutorial[] = [
  {
    id: LEGACY_TUTORIAL_IDS.TRAVEL_TO_TOWN,
    title: 'Travel to Town',
    description: 'The road from the wood ahead leads toward the nearby town of Oron. Travel there using Character actions.',
    hints: [
      {
        title: 'Characters List',
        description: `Click the "${ContextMenuIcon.characters}" circle on the left to access your character list.`,
        uiPath: 'characters',
        quickOverlayMode: 'characters',
        quickOverlayModeDescription: 'to Character List',
        alternate: {
          description: `Click the "${ContextMenuIcon.character_manage}", to view the character manager and bypass the character list and "${ContextMenuIcon.settings}" click steps.`,
          quickOverlayMode: 'character_manage',
          quickOverlayModeDescription: 'to Character Manager'
        }
      },
      {
        title: 'Manage Character',
        description: `Click the "${ContextMenuIcon.settings}" on the right of the character you wish to manage.`,
        uiPath: 'characters:manage',
        quickOverlayMode: 'character_manage',
        quickOverlayModeDescription: 'to Character Manager',
        alternate: {
          description: `Click the "${ContextMenuIcon.character_manage}", to view the character manager and bypass the character list and "${ContextMenuIcon.settings}" click steps.`,
          quickOverlayMode: 'character_manage',
          quickOverlayModeDescription: 'to Character Manager',
        }
      },
      {
        title: 'Travel Actions',
        description: `Click "${ContextMenuIcon.start}" on the "Town of Oron" travel action.`,
        uiPath: 'characters:manage:travel:town',
      },
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character is at the "Town of Oron" location.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.VISIT_ADV_GUILD,
    title: "Adventurer's Guild",
    description: "Visit the local Adventurer's Guild in town to take a quest.",
    hints: [
      {
        title: 'Current Location',
        description: 'Managed character is at the "Town of Oron".',
        quickOverlayMode: 'character_manage',
        quickOverlayModeDescription: 'to Character Manage',
      },
      {
        title: 'Characters List',
        description: `Click the "${ContextMenuIcon.characters}" circle on the left to access your character list.`,
        uiPath: 'characters',
        quickOverlayMode: 'characters',
        quickOverlayModeDescription: 'to Character List',
        alternate: {
          description: `Click the "${ContextMenuIcon.character_manage}", to view the character manager and bypass the character list and "${ContextMenuIcon.settings}" click steps.`,
          quickOverlayMode: 'character_manage',
          quickOverlayModeDescription: 'to Character Manager',
        }
      },
      {
        title: 'Manage Character',
        description: `Click the "${ContextMenuIcon.settings}" on the right of the character you wish to manage.`,
        uiPath: 'characters:manage',
        quickOverlayMode: 'character_manage',
        quickOverlayModeDescription: 'to Character Manager',
        alternate: {
          description: `Click the "${ContextMenuIcon.character_manage}", to view the character manager and bypass the character list and "${ContextMenuIcon.settings}" click steps.`,
          quickOverlayMode: 'character_manage',
          quickOverlayModeDescription: 'to Character Manager',
        }
      },
      {
        title: 'Travel Actions',
        description: `Click "${ContextMenuIcon.start}" on the "Oron Adventurer's Guild" travel action.`,
        uiPath: 'characters:manage:travel:adv_guild',
      },
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character is at the "Oron Adventurer\'s Guild" location.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.ACCEPT_FIRST_QUEST,
    title: 'Run a Quest',
    description: "Take your first quest at the Adventurer's Guild.",
    hints: [
      {
        title: 'Current Location',
        description: 'While at the "Oron Adventurer\'s Guild" in the character manager...',
      },
      {
        title: 'Enter the Guild',
        description: 'Click the action to "Enter the Oron Adventuer\'s Guild" to bring up the guild window.',
        uiPath: 'characters:manage:action:adv_guild',
        quickOverlayMode: 'character_manage',
        alternate: {
          description: `Click the "${ContextMenuIcon.adv_guild}", to view the current Adventurer\'s Guild management window to bypass character list, management, and the enter guild button action.`,
          quickOverlayMode: 'adv_guild',
          quickOverlayModeDescription: 'to Adventurer\'s Guild',
        }
      },
      {
        title: 'Visit the Quest Board',
        description: 'Once at the guild clerk select the quest board, view and accept a quest. There are time, mob kill, item gathering, and profession quests avaiable. Some may be restricted due to various requirements.',
        quickOverlayMode: 'adv_guild',
      }
    ],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character has taken any quest.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.COMPLETE_FIRST_QUEST,
    title: 'Quest Complete',
    description: "Turn in your first quest at the Adventurer's Guild.",
    hints: [],
    rewards: [
      {
        ...getBaseTutorialRewards('player'),
        characterTokens: 1
      },
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character has completed a quest.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.CREATE_SECOND_CHARACTER,
    title: 'Battle Buddy',
    description: 'Create a second character with your new character token.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Have two total characters.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.CREATE_FIRST_PARTY,
    title: 'Party Hardy',
    description: 'Create a party with a character.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character has created a party.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.JOIN_PARTY,
    title: 'Party on Garth',
    description: "Have another character join an existing character's party.",
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Two, or more, characters are in a party together.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.PARTY_ROLES,
    title: 'Party Hardy',
    description: 'Assign a party role to a party member.',
    hints: [],
    rewards: [
      {
        ...getBaseTutorialRewards('player'),
        characterTokens: 3
      },
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Any character in a party has a role assigned.'
  },

  {
    id: LEGACY_TUTORIAL_IDS.FULL_PARTY,
    title: 'No Occupancy',
    description: 'Create 3 more characters and have them join your party. A tank, healer, and 3 damage dealers are required for dungeons and raids.',
    hints: [],
    rewards: [
      getBaseTutorialRewards('player'),
      getBaseTutorialRewards('character'),
    ],
    requirement: 'Five characters are in a party together.'
  },
]