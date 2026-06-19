import type { UpgradeEntity } from '../types/UpdateEntity.types'

export const GAME_UPGRADE_IDS = {
  HP_1: 'hp_1',
  STRENGTH_1: 'strength_1'
} as const

export const GAME_UPGRADES: UpgradeEntity[] = [
  {
    id: GAME_UPGRADE_IDS.HP_1,

    title: 'Healthy I',
    titleString: 'Healthy I',

    description: 'Increase maximum health by 10.',

    requirements: [
      {
        id: 'healthy_1_req_level',
        characterLevel: 1
      },
      {
        id: 'healthy_1_req_gold',
        gold: 10
      }
    ],

    rewards: [
      {
        hp: 10
      }
    ]
  },

  {
    id: GAME_UPGRADE_IDS.STRENGTH_1,

    title: 'Strong I',
    titleString: 'Strong I',

    description: 'Increase strength by 1.',

    requirements: [
      {
        id: 'strong_1_req',
        characterLevel: 3
      }
    ],

    rewards: [
      {
        strength: 1
      }
    ]
  }
]