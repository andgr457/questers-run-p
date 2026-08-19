import type { EntityBase } from '../../entity/types/Entity.types'
import type { RankLevel } from '../../rank/types/Rank.types'

export interface GuildRankRequirements {
  level: number
  achievements: number
  quests: number
  members: number
  memberLevels: number
  dungeons: number
  raids: number
}

export interface Guild extends EntityBase {
  rankLevel: RankLevel
  upgrades: GuildUpgrades
}

export interface GuildUpgrade {
  title: string
  levelMax: number
  levelMultiplier: number
  value: number
  requirements: {
    gold: number
    level: number
  }
}

export interface GuildUpgradeCategories {
  quest: GuildUpgrade
  profession: GuildUpgrade
  hunting: GuildUpgrade
  dungeon: GuildUpgrade
  raid: GuildUpgrade
}

export interface GuildUpgrades {
  members: GuildUpgrade
  bank: {
    storage: GuildUpgrade
    gold: GuildUpgrade
  }
  speed: GuildUpgradeCategories
  gold: GuildUpgradeCategories
  xp: GuildUpgradeCategories
}
