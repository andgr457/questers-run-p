export interface TutorialProgress {
  completedTutorialIds: string[]
}

export interface Tutorial {
  id: string
  title: string
  description: string
  rewards: {
    player?: {
      xp?: number
      gold?: number
      characterTokens?: number
    }
    characterSpecific?: {
      xp?: number
      gold?: number
    }
    charactersAll?: {
      xp?: number
      gold?: number
    }
  }
}