import type { OverlayMode } from '../../context-menu/types/OverlayMode.types'


export interface TutorialProgressMeta {
  tutorialId: string
  completed: boolean
  dateCompleted: number
  collected?: boolean
  dateCollected?: number
}

export interface TutorialProgress {
  playerTutorialProgress: TutorialProgressMeta[]
}

export type TutorialUIPath = 'characters'
  | 'characters:manage'
  | 'characters:manage:travel:town'
  | 'characters:manage:travel:adv_guild'
  
  | 'characters:manage:action:adv_guild'
  | 'adv_guild:quest:q_01_gather_berries'

export interface TutorialHint {
  title: string
  description: string
  quickOverlayMode?: OverlayMode
  quickOverlayModeDescription?: string
  uiPath?: TutorialUIPath
  alternate?: {
    description: string
    quickOverlayMode?: OverlayMode
    quickOverlayModeDescription?: string
  }
}

export interface Tutorial {
  id: string
  title: string
  description: string
  requirement: string
  hints: TutorialHint[]
  rewards: TutorialReward[]
}

export type TutorialRewardType = 'player'
  | 'character'
  
export interface TutorialReward {
  type: TutorialRewardType
  xp?: number 
  gold?: number
  characterTokens?: number
}

 