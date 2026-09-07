import type { Guild } from '../../../interfaces/Guild.types'

export interface GuildBaseEventMeta {
  guildId: string
}

export interface GuildCreateEventMeta extends GuildBaseEventMeta {
  guild: Guild
}

export interface GuildCreatedEventMeta extends GuildBaseEventMeta {
  guild: Guild
}

export interface GuildSaveEventMeta extends GuildBaseEventMeta {
  guild: Guild
}

export interface GuildSavedEventMeta extends GuildBaseEventMeta {
  guild: Guild
}

export interface GuildGoldAddEventMeta extends GuildBaseEventMeta {
  value: number
}

export interface GuildGoldAddedEventMeta extends GuildBaseEventMeta {
  value: number
}

export interface GuildXPAddEventMeta  extends GuildBaseEventMeta {
  value: number
}

export interface GuildXPAddedEventMeta extends GuildBaseEventMeta {
  value: number
}

export interface GuildLevelAddedEventMeta extends GuildBaseEventMeta {
  level: number
}

export interface GuildUpgradeAddEventMeta extends GuildBaseEventMeta {

}

export interface GuildUpgradeAddedEventMeta {

}

export interface GuildEventMap {
  'guild:create': GuildCreateEventMeta,
  'guild:created': GuildCreatedEventMeta,

  'guild:save': GuildSaveEventMeta
  'guild:saved': GuildSavedEventMeta

  'guild:gold:add': GuildGoldAddEventMeta
  'guild:gold:added': GuildGoldAddedEventMeta

  'guild:xp:add': GuildXPAddEventMeta
  'guild:xp:added': GuildXPAddedEventMeta

  'guild:level:added': GuildLevelAddedEventMeta

  'guild:upgrade:add': GuildUpgradeAddEventMeta
  'guild:upgrade:added': GuildUpgradeAddedEventMeta
}


