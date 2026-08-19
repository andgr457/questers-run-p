import type { GuildMaster, GuildMasterUpgrades } from '../../../entities/guild-master/types/GuildMaster.types'

export interface GuildMasterCreateEventMeta {
  guildMaster: GuildMaster
}

export interface GuildMasterCreatedEventMeta {
  guildMaster: GuildMaster
}

export interface GuildMasterSaveEventMeta {
  guildMaster: GuildMaster
}

export interface GuildMasterSavedEventMeta {
  guildMaster: GuildMaster
}

export interface GuildMasterGoldAddEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterGoldAddedEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterXPAddEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterXPAddedEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterLevelAddedEventMeta {
  guildMasterId: string
  level: number
}

export interface GuildMasterTokenAddEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterTokenAddedEventMeta {
  guildMasterId: string
  amount: number
}

export interface GuildMasterUpgradeAddEventMeta {
  guildMasterId: string
  upgrades: Partial<GuildMasterUpgrades>
}

export interface GuildMasterUpgradeAddedEventMeta {
  guildMasterId: string
  upgrades: Partial<GuildMasterUpgrades>
}

export interface GuildMasterEventMap {
  'gm:create': GuildMasterCreateEventMeta,
  'gm:created': GuildMasterCreatedEventMeta,

  'gm:save': GuildMasterSaveEventMeta
  'gm:saved': GuildMasterSavedEventMeta

  'gm:gold:add': GuildMasterGoldAddEventMeta
  'gm:gold:added': GuildMasterGoldAddedEventMeta

  'gm:xp:add': GuildMasterXPAddEventMeta
  'gm:xp:added': GuildMasterXPAddedEventMeta

  'gm:level:added': GuildMasterLevelAddedEventMeta

  'gm:token:add': GuildMasterTokenAddEventMeta
  'gm:token:added': GuildMasterTokenAddedEventMeta

  'gm:upgrade:add': GuildMasterUpgradeAddEventMeta
  'gm:upgrade:added': GuildMasterUpgradeAddedEventMeta
}


