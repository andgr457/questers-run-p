import type { Upgrade } from '../../upgrade/types/Upgrade.types'

export interface Guild {
  id: string
  name: string
  level: number
  xp: number
  xpNextLevel: number
  gold: number

  upgrades: GuildUpgrades
}

export interface GuildUpgrades {
  maxCharacters: Upgrade
  maxGold: Upgrade
  maxLevel: Upgrade
}
