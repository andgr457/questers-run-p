import type { EntityBase } from '../../entity/types/Entity.types'
import type { Upgrade } from '../../upgrade/types/Upgrade.types'

export interface GuildMaster extends EntityBase {


  //applies onto characters as well (guild + player + character upgrades = guild, player, and character gains)
  upgrades: GuildMasterUpgrades
}

export interface GuildMasterUpgrades {
  xpPerQuest: Upgrade
  goldPerQuest: Upgrade
  speedPerQuest: Upgrade
}
