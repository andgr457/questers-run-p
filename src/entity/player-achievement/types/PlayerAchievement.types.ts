
export interface PlayerAchievement {
  id: string
  title: string
  description: string
  achieved: boolean
  achievedOn: number
  requirements: PlayerAchievementRequirement[]
}

export interface PlayerAchievementRequirement {
  player?: {
    created?: boolean
    level?: number
  }
  gold?: {
    current?: number
    ever?: number
  }
  characterAny?: {
    level?: number
    amount?: number
  }
  mobSpecific?: {
    mobId: string
    amount: number
  }
  mobAny?: {
    amount: number
  }
  
}