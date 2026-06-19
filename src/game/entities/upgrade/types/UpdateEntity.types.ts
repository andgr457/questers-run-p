import React from 'react'

export interface UpgradeEntity {
  id: string

  title: React.ReactNode
  titleString: string

  description: React.ReactNode

  requirements: UpgradeRequirementEntity[]

  rewards: UpgradeRewardEntity[]
}

export interface UpgradeRewardEntity {
  characterTokens?: number

  hp?: number
  mana?: number
  stamina?: number

  strength?: number
  intellect?: number
  agility?: number
}

export interface UpgradeRequirementEntity {
  id: string

  upgradeId?: string

  characterLevel?: number

  characterQuestCount?: number

  characterMobCountSpecificId?: string
  characterMobCountSpecific?: number

  characterMobCountAny?: number

  gold?: number
}