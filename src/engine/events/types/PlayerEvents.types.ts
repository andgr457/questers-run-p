import type { Player, PlayerUpgrades } from '../../../entities/player/types/Player.types'

export interface PlayerCreateEventMeta {
  player: Player
}

export interface PlayerCreatedEventMeta {
  player: Player
}

export interface PlayerSaveEventMeta {
  player: Player
}

export interface PlayerSavedEventMeta {
  player: Player
}

export interface PlayerGoldAddEventMeta {
  amount: number
}

export interface PlayerGoldAddedEventMeta {
  amount: number
}

export interface PlayerXPAddEventMeta {
  amount: number
}

export interface PlayerXPAddedEventMeta {
  amount: number
}

export interface PlayerLevelAddedEventMeta {
  level: number
}

export interface PlayerTokenAddEventMeta {
  amount: number
}

export interface PlayerTokenAddedEventMeta {
  amount: number
}

export interface PlayerUpgradeAddEventMeta {
  upgrades: Partial<PlayerUpgrades>
}

export interface PlayerUpgradeAddedEventMeta {
  upgrades: Partial<PlayerUpgrades>
}

export interface PlayerEventMap {
  'player:create': PlayerCreateEventMeta,
  'player:created': PlayerCreatedEventMeta,

  'player:save': PlayerSaveEventMeta
  'player:saved': PlayerSavedEventMeta

  'player:gold:add': PlayerGoldAddEventMeta
  'player:gold:added': PlayerGoldAddedEventMeta

  'player:xp:add': PlayerXPAddEventMeta
  'player:xp:added': PlayerXPAddedEventMeta

  'plpayer:level:added': PlayerLevelAddedEventMeta

  'player:token:add': PlayerTokenAddEventMeta
  'player:token:added': PlayerTokenAddedEventMeta

  'player:upgrade:add': PlayerUpgradeAddEventMeta
  'player:upgrade:added': PlayerUpgradeAddedEventMeta
}


