import type { Guild } from '../../../entities/guild/types/Guild.types'

export interface GuildCreateEventMeta {
  guild: Guild
}

export interface GuildCreatedEventMeta {
  guild: Guild
}

export interface GuildSaveEventMeta {
  guild: Guild
}

export interface GuildSavedEventMeta {
  guild: Guild
}

export interface GuildGoldAddEventMeta {
  guildId: string
  amount: number
}

export interface GuildGoldAddedEventMeta {
  guildId: string
  amount: number
}

export interface GuildXPAddEventMeta {
  guildId: string
  amount: number
}

export interface GuildXPAddedEventMeta {
  guildId: string
  amount: number
}

export interface GuildLevelAddedEventMeta {
  guildId: string
  level: number
}

export interface GuildUpgradeAddEventMeta {
  guildId: string
}

export interface GuildUpgradeAddedEventMeta {
  guildId: string
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


