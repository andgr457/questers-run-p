import type { CharacterUpgrade } from '../types/CharacterUpgrade.types'

export const GAME_CHARACTER_UPGRADE_IDS = {
  CHARACTER_UPGRADE_001_QUEST_SPEED: 'cu_001_quest_speed',
}

const CHARACTER_UPGRADE_001_QUEST_SPEED: CharacterUpgrade = {
  id: GAME_CHARACTER_UPGRADE_IDS.CHARACTER_UPGRADE_001_QUEST_SPEED,
  title: 'Quest Speed',
  description: 'Decrease the time taken to complete a quest.',
  maxUpgradeLevel: 10,
  levels: [
    {
      upgradeLevel: 1,
      description: '10%',
      requires: {
        gold: 1,
        level: 1
      },
      upgrades: {
        questSpeed: 0.1
      }
    },
    {
      upgradeLevel: 2,
      description: '10%',
      requires: {
        gold: 2,
        level: 1
      },
      upgrades: {
        questSpeed: 0.1
      }
    },
    {
      upgradeLevel: 3,
      description: '20%',
      requires: {
        gold: 3,
        level: 1
      },
      upgrades: {
        questSpeed: 0.2
      }
    },
    {
      upgradeLevel: 4,
      description: '20%',
      requires: {
        gold: 4,
        level: 1
      },
      upgrades: {
        questSpeed: 0.2
      }
    },
    {
      upgradeLevel: 5,
      description: '20%',
      requires: {
        gold: 5,
        level: 1
      },
      upgrades: {
        questSpeed: 0.2
      }
    }
  ]
}

