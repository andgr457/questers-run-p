export interface TutorialProgress {
  completedTutorialIds: string[]
}

export interface TutorialHint {
  title: string
  description: string
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

 