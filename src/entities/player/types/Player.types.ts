import type { Upgrade } from '../../upgrade/types/Upgrade.types'

export interface Player {
  id: string
  name: string
  level: number
  xp: number
  xpNextLevel: number
  gold: number
  tokens: number
  stamina: number
  staminaMax: number

  //applies onto characters as well (guild + player + character upgrades = guild, player, and character gains)
  upgrades: PlayerUpgrades
}

export interface PlayerUpgrades {
  xpPerQuest: Upgrade
  goldPerQuest: Upgrade
  speedPerQuest: Upgrade
}
