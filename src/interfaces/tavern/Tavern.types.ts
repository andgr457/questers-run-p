
export interface TavernItemRequirement {
  gold?: number
  timeInSeconds?: number
}

export interface TavernItemReward {
  statsModifyPercent?: number
}

export interface TavernListItem {
  id: string
  title: string
  description: string
  requirements: TavernItemRequirement
  rewards: TavernItemReward
}
