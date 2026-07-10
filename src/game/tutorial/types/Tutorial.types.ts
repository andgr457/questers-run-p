export interface TutorialProgress {
  completedTutorialIds: string[]
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
  uiPath?: TutorialUIPath
}

export interface Tutorial {
  id: string
  title: string
  description: string
  hints: TutorialHint[]
  rewards: TutorialReward[]
}

export type TutorialRewardType = 'player'
  | 'character'
  | 'characters'
  
export interface TutorialReward {
  type: TutorialRewardType
  xp?: number 
  gold?: number
  characterTokens?: number
}

 