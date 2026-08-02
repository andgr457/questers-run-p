export interface CharacterUpgrade {
  id: string
  title: string
  description: string
  maxUpgradeLevel: number
  levels: CharacterUpgradeLevel[]
}

export interface CharacterUpgradeLevel {
  upgradeLevel: number
  description: string
  requires: {
    level: number
    gold: number
  }
  upgrades: {
    questSpeed?: number
    questXp?: number
    questGold?: number
  }
}